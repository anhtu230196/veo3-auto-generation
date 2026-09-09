#!/usr/bin/env python3
"""Luong review nhieu vong giua cac agent tren mot san pham trung gian.

Dung chung cho moi agent (Codex, Claude, Gemini). Xem AGENTS.md muc 8.

    python scripts/thread.py new net-0007-khung-suon \\
        --artifact t-i/outputs/.../scripts/01-beat-sheet.md \\
        --author claude --reviewers gemini,codex \\
        --question "Khung nay co nut that nao khong co chung cu do khong?"
    python scripts/thread.py status
    python scripts/thread.py next net-0007-khung-suon
    python scripts/thread.py apply net-0007-khung-suon r1-01-review-gemini.md
    python scripts/thread.py check
"""
from __future__ import annotations

import argparse
import re
import sys
from datetime import date
from pathlib import Path

AGENTS = ["codex", "claude", "gemini"]
STATUSES = ["open", "blocked", "settled"]
ROLES = ["author", "reviewer"]
MAX_ROUND = 3
MAX_REBUTTALS = 2
SLUG_RE = re.compile(r"^[a-z0-9][a-z0-9-]*$")
FILE_RE = re.compile(r"^r(\d+)-(\d{2})-(proposal|review|response)-([a-z]+)\.md$")
POINT_ROW_RE = re.compile(r"^\|\s*(D\d+)\s*\|")
POINTS_BLOCK_RE = re.compile(r"```points\s*\n(.*?)```", re.S)
OPEN_MARKS = ("mở", "chờ")

REQUIRED = ["id", "artifact", "artifact_version", "author", "reviewers",
            "round", "turn", "turn_role", "status", "opened", "updated"]

TABLE_HEADER = "| ID | Nêu bởi | Vòng | Nội dung | Trạng thái |"
TABLE_SEP = "| --- | --- | --- | --- | --- |"


# ---------------------------------------------------------------- doc / ghi

def repo_root() -> Path:
    return Path(__file__).resolve().parents[1]


def threads_dir() -> Path:
    return repo_root() / "coordination" / "threads"


def parse_front_matter(text: str):
    """Doc frontmatter YAML phang: key: value va danh sach '- muc'."""
    if not text.startswith("---"):
        return None, "khong co frontmatter mo dau bang ---"
    end = text.find("\n---", 3)
    if end == -1:
        return None, "frontmatter khong duoc dong bang ---"
    data, key = {}, None
    for raw in text[3:end].splitlines():
        line = raw.rstrip()
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if line.lstrip().startswith("- ") and key:
            data.setdefault(key, [])
            if isinstance(data[key], list):
                data[key].append(line.lstrip()[2:].strip())
            continue
        if ":" not in line:
            return None, f"dong khong doc duoc trong frontmatter: {line!r}"
        key, _, value = line.partition(":")
        key, value = key.strip(), value.strip()
        data[key] = value if value else []
    return data, None


def set_front_matter(text: str, **fields) -> str:
    """Doi cac khoa vo huong trong frontmatter, giu nguyen thu tu va phan con lai."""
    end = text.find("\n---", 3)
    head, tail = text[:end], text[end:]
    for key, value in fields.items():
        pat = re.compile(rf"^({re.escape(key)}:).*$", re.M)
        if pat.search(head):
            head = pat.sub(rf"\1 {value}", head, count=1)
        else:
            head = head.rstrip() + f"\n{key}: {value}"
    return head + tail


def read_thread(slug: str):
    d = threads_dir() / slug
    f = d / "THREAD.md"
    if not f.exists():
        sys.exit(f"khong tim thay luong {slug!r}. Chay: python scripts/thread.py status")
    text = f.read_text(encoding="utf-8")
    data, err = parse_front_matter(text)
    if err:
        sys.exit(f"{f} hong: {err}")
    return d, data, text


def load_threads():
    out = []
    if not threads_dir().is_dir():
        return out
    for d in sorted(threads_dir().iterdir()):
        if not d.is_dir() or d.name.startswith("_"):
            continue
        f = d / "THREAD.md"
        if not f.exists():
            out.append((d, None, None, "thieu THREAD.md"))
            continue
        text = f.read_text(encoding="utf-8")
        data, err = parse_front_matter(text)
        out.append((d, data, text, err))
    return out


# ---------------------------------------------------------------- diem

def reviewers_of(data) -> list:
    r = data.get("reviewers") or []
    if isinstance(r, str):
        r = [x.strip() for x in r.split(",") if x.strip()]
    return r


def participants(data) -> list:
    return [data.get("author")] + reviewers_of(data)


def read_points(text: str) -> list:
    """Doc bang diem trong THREAD.md -> [{id, by, round, note, state}]."""
    out = []
    for line in text.splitlines():
        if not POINT_ROW_RE.match(line):
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        while len(cells) < 5:
            cells.append("")
        out.append({"id": cells[0], "by": cells[1], "round": cells[2],
                    "note": cells[3], "state": cells[4]})
    return out


def is_open(state: str) -> bool:
    return any(m in state for m in OPEN_MARKS)


def write_points(text: str, points: list) -> str:
    """Thay bang diem trong THREAD.md bang danh sach moi."""
    lines = text.splitlines()
    start = next((i for i, l in enumerate(lines) if l.strip() == TABLE_HEADER), None)
    if start is None:
        return text
    end = start + 2
    while end < len(lines) and POINT_ROW_RE.match(lines[end]):
        end += 1
    rows = [f"| {p['id']} | {p['by']} | {p['round']} | {p['note']} | {p['state']} |"
            for p in points]
    return "\n".join(lines[:start + 2] + rows + lines[end:]) + "\n"


def parse_points_block(text: str):
    """Doc khoi ```points``` trong file vong -> [(id, state, note)] hoac None."""
    m = POINTS_BLOCK_RE.search(text)
    if not m:
        return None
    out = []
    for raw in m.group(1).splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        cells = [c.strip() for c in line.split("|")]
        if len(cells) < 2 or not re.match(r"^D\d+$", cells[0]):
            return f"dong khong doc duoc trong khoi points: {line!r}"
        out.append((cells[0], cells[1], " · ".join(c for c in cells[2:] if c)))
    return out


# ---------------------------------------------------------------- luot

def next_index(d: Path, rnd: int) -> int:
    return sum(1 for p in d.glob(f"r{rnd}-*.md") if FILE_RE.match(p.name))


def turn_prompt(d: Path, data: dict):
    """Mo ta luot hien tai + cau prompt cho agent. None neu luong da dong."""
    if data.get("status") != "open":
        return None
    turn, role = data.get("turn"), data.get("turn_role")
    rnd = int(data.get("round", 1))
    rel = d.relative_to(repo_root()).as_posix()
    artifact = data.get("artifact")
    nn = next_index(d, rnd)
    kind = "proposal" if (role == "author" and rnd == 1) else (
        "response" if role == "author" else "review")
    fname = f"r{rnd}-{nn:02d}-{kind}-{turn}.md"

    if role == "author" and rnd == 1:
        exists = (repo_root() / str(artifact)).exists()
        step = (f"San pham da co san o {artifact}. Doc lai va bo sung nhung gi con thieu\n"
                f"de nguoi khac review duoc."
                if exists else f"Viet san pham vao {artifact}.")
        body = f"""Doc {rel}/THREAD.md va AGENTS.md muc 8 truoc.

Ban la TAC GIA buoc nay. {step}

San pham cua luot nay la noi dung file vong {fname}: ban da quyet dinh gi va vi sao, cho nao ban tu thay
yeu nhat, cau hoi nao ban muon nguoi review tra loi, va cai gi ban co y chua lam
vi thuoc buoc sau."""
    elif role == "author":
        body = f"""Doc {rel}/THREAD.md, AGENTS.md muc 8 va .claude/skills/deliberation/SKILL.md
truoc. Doc tat ca file vong truoc trong {rel}/.

Ban la TAC GIA. San pham cua luot nay la noi dung file vong {fname}.

Tra loi TUNG diem dang mo trong bang diem: chap nhan va sua,
hoac phan bac bang mot trong bon ly do o muc 8. Khong im lang bo qua diem nao,
va khong sua lay le cho diem bien mat.

Sua {artifact} cho cac diem ban chap nhan, roi bao artifact_version moi.

Trong file vong ghi ro tung diem: da sua o dau, hoac phan bac vi ly do gi."""
    else:
        body = f"""Ban REVIEW buoc nay. San pham cua luot nay la noi dung file vong {fname}.

Doc theo thu tu: {rel}/THREAD.md (cau hoi luong nay phai tra loi + bang diem),
cac file vong truoc trong {rel}/ neu co, roi {artifact} (ban v{data.get('artifact_version')}).

Moi y mot ma D** moi. Neu tac gia da phan bac mot diem cua ban o vong truoc:
chap nhan, dua chung cu moi, hoac day len Tu — khong lap lai y cu.

Luat review va dinh dang diem da o phan dau prompt nay. Tham chieu day du:
AGENTS.md muc 8, .claude/skills/deliberation/SKILL.md — chi mo khi can tra."""

    return {"turn": turn, "role": role, "round": rnd, "kind": kind,
            "file": fname, "path": d / fname, "artifact": artifact,
            "needs_write": role == "author", "prompt": body}


def advance(d: Path, data: dict, text: str, actor: str, points_block, bump_version: bool):
    """Cap nhat bang diem, doi luot, tra ve (text moi, ghi chu)."""
    notes = []
    rnd = int(data["round"])
    role = data["turn_role"]
    revs = reviewers_of(data)
    points = read_points(text)
    by_id = {p["id"]: p for p in points}
    version = int(data.get("artifact_version", 1))

    for pid, state, note in (points_block or []):
        if pid in by_id:
            prev = by_id[pid]["state"]
            by_id[pid]["state"] = state
            if "phản bác" in prev and "phản bác" in state:
                notes.append(f"{pid}: phan bac lan hai — theo doi tran {MAX_REBUTTALS}.")
            # Giu mo ta goc cua diem: do la phat bieu van de, thu huu ich nhat
            # trong bang. Chi tiet cach giai quyet nam trong file vong.
            if note and not by_id[pid]["note"]:
                by_id[pid]["note"] = note
        else:
            points.append({"id": pid, "by": actor, "round": f"r{rnd}",
                           "note": note, "state": state})
            by_id[pid] = points[-1]

    if bump_version:
        version += 1

    # tran phan bac: mot diem qua lai qua MAX_REBUTTALS lan thi day len nguoi
    for p in points:
        if p["state"].count("phản bác") and int(p.get("round", "r1")[1:] or 1) <= rnd - MAX_REBUTTALS:
            p["state"] = "đẩy lên Tú"
            notes.append(f"{p['id']}: qua {MAX_REBUTTALS} lan qua lai — chuyen 'đẩy lên Tú'.")

    still_open = [p for p in points if is_open(p["state"])]
    # 'đẩy lên Tú' khong con la diem mo giua cac agent, nhung luong van chua
    # dong duoc: no dang cho nguoi tra loi.
    escalated = [p for p in points if "đẩy lên Tú" in p["state"]]

    if role == "author":
        nxt, nxt_role, nxt_round, status = revs[0], "reviewer", rnd, "open"
    else:
        i = revs.index(actor) if actor in revs else len(revs) - 1
        if i < len(revs) - 1:
            nxt, nxt_role, nxt_round, status = revs[i + 1], "reviewer", rnd, "open"
        elif not still_open:
            status = "blocked" if escalated else "settled"
            nxt, nxt_role, nxt_round = data["author"], "author", rnd
            if escalated:
                notes.append(
                    f"Con {len(escalated)} diem day len Tu "
                    f"({', '.join(p['id'] for p in escalated)}) -> blocked, chua settled.")
        elif rnd >= MAX_ROUND:
            nxt, nxt_role, nxt_round, status = data["author"], "author", rnd, "blocked"
            notes.append(f"Het tran {MAX_ROUND} vong, con {len(still_open)} diem mo -> blocked.")
        else:
            nxt, nxt_role, nxt_round, status = data["author"], "author", rnd + 1, "open"

    text = write_points(text, points)
    text = set_front_matter(text, round=nxt_round, turn=nxt, turn_role=nxt_role,
                            status=status, artifact_version=version,
                            updated=date.today().isoformat())
    return text, notes, status


# ---------------------------------------------------------------- lenh

def cmd_new(args) -> int:
    slug = args.slug
    if not SLUG_RE.match(slug):
        sys.exit("slug chi gom chu thuong, so va dau gach ngang.")
    if args.author not in AGENTS:
        sys.exit(f"author phai thuoc {AGENTS}.")
    reviewers = [r.strip() for r in args.reviewers.split(",") if r.strip()]
    bad = [r for r in reviewers if r not in AGENTS]
    if bad:
        sys.exit(f"reviewer khong hop le: {bad}")
    if args.author in reviewers:
        sys.exit("tac gia khong duoc dong thoi la nguoi review cua chinh minh.")
    if not reviewers:
        sys.exit("can it nhat mot nguoi review.")

    d = threads_dir() / slug
    if d.exists():
        sys.exit(f"{d.relative_to(repo_root()).as_posix()} da ton tai.")
    artifact = Path(args.artifact)
    if not (repo_root() / artifact).exists():
        print(f"  canh bao: chua co {artifact.as_posix()} — tac gia se tao o luot dau.")

    d.mkdir(parents=True)
    today = date.today().isoformat()
    reviewer_lines = "\n".join(f"  - {r}" for r in reviewers)
    (d / "THREAD.md").write_text(
        f"""---
id: {slug}
step: {args.step or ""}
artifact: {artifact.as_posix()}
artifact_version: 1
author: {args.author}
reviewers:
{reviewer_lines}
round: 1
turn: {args.author}
turn_role: author
status: open
opened: {today}
updated: {today}
---

# {slug}

**Sản phẩm đang review:** `{artifact.as_posix()}`

## Câu hỏi luồng này phải trả lời

{args.question}

## Điểm tranh luận

{TABLE_HEADER}
{TABLE_SEP}

## Nhật ký vòng

- r1 · {args.author} (tác giả) · **đang chờ**

## Ngoài lượt

Việc gấp phát hiện khi chưa tới lượt mình thì ghi một dòng ở đây, không viết file vòng.
""",
        encoding="utf-8",
    )
    print(f"da tao {(d / 'THREAD.md').relative_to(repo_root()).as_posix()}")
    print(f"Buoc tiep: python scripts/thread.py next {slug}")
    return 0


def cmd_status(args) -> int:
    rows = []
    for d, data, text, err in load_threads():
        if err or not data:
            rows.append((d.name, "?", "?", "?", f"loi: {err}"))
            continue
        if args.slug and data.get("id") != args.slug:
            continue
        pts = [p for p in read_points(text or "") if is_open(p["state"])]
        rows.append((
            str(data.get("id")), f"r{data.get('round')}",
            f"{data.get('turn')} ({data.get('turn_role')})", str(data.get("status")),
            f"{len(pts)} diem mo" + (": " + ", ".join(p["id"] for p in pts) if pts else ""),
        ))
    if not rows:
        print("khong co luong nao")
        return 0
    w = [max(len(r[i]) for r in rows) for i in range(4)]
    for r in rows:
        print(f"{r[0]:<{w[0]}}  {r[1]:<{w[1]}}  {r[2]:<{w[2]}}  {r[3]:<{w[3]}}  {r[4]}")
    return 0


def cmd_next(args) -> int:
    d, data, text = read_thread(args.slug)
    t = turn_prompt(d, data)
    if t is None:
        pts = [p for p in read_points(text) if is_open(p["state"])]
        print(f"Luong {args.slug} dang {data.get('status')}. Khong co luot nao de chay.")
        for p in pts:
            print(f"  {p['id']}: {p['state']} — {p['note']}")
        return 0
    print(f"=== Toi luot: {t['turn']} ({t['role']}) · vong {t['round']}/{MAX_ROUND} ===\n")
    print("Dan nguyen doan duoi day cho agent do:\n")
    print("-" * 68)
    print(t["prompt"])
    print(f"""
Ghi noi dung do vao {(d / t['file']).relative_to(repo_root()).as_posix()}.

Cuoi file phai co mot khoi nhu sau de may doc duoc, moi diem mot dong:

```points
D01 | mở | file:dong | tom tat mot dong
```

Trang thai hop le: mở · đã sửa ở v<N> · tác giả phản bác — chờ <agent> ·
chốt: đã sửa · chốt: giữ nguyên · đẩy lên Tú

Sau do chay: python scripts/thread.py apply {args.slug} {t['file']}""")
    print("-" * 68)
    return 0


def cmd_apply(args) -> int:
    d, data, text = read_thread(args.slug)
    f = d / args.file
    if not f.exists():
        sys.exit(f"khong thay {f.relative_to(repo_root()).as_posix()}")
    m = FILE_RE.match(f.name)
    if not m:
        sys.exit(f"{f.name}: sai dinh dang r<vong>-<NN>-<loai>-<agent>.md")
    actor = m.group(4)
    if actor != data.get("turn"):
        sys.exit(f"{f.name} la cua {actor} nhung dang toi luot {data.get('turn')}.")

    block = parse_points_block(f.read_text(encoding="utf-8"))
    if isinstance(block, str):
        sys.exit(block)
    if block is None:
        sys.exit(f"{f.name} khong co khoi ```points```. Khong cap nhat duoc bang diem.")

    new_text, notes, status = advance(d, data, text, actor, block,
                                      bump_version=(m.group(3) == "response"))
    (d / "THREAD.md").write_text(new_text, encoding="utf-8")
    for n in notes:
        print(f"  ghi chu: {n}")
    print(f"da ap dung {f.name} — luong chuyen sang {status}")
    if status == "open":
        print(f"Buoc tiep: python scripts/thread.py next {args.slug}")
    return 0


def cmd_check(args) -> int:
    problems, notes = [], []
    threads = load_threads()
    for d, data, text, err in threads:
        rel = d.relative_to(repo_root()).as_posix()
        if err or not data:
            problems.append(f"{rel}: {err or 'khong doc duoc THREAD.md'}")
            continue

        missing = [k for k in REQUIRED if not data.get(k) and data.get(k) != 0]
        if missing:
            problems.append(f"{rel}: frontmatter thieu {', '.join(missing)}.")
            continue

        if data["id"] != d.name:
            problems.append(f"{rel}: id {data['id']!r} khong trung ten thu muc.")
        if data["author"] not in AGENTS:
            problems.append(f"{rel}: author {data['author']!r} khong hop le.")
        people = participants(data)
        if data["author"] in people[1:]:
            problems.append(f"{rel}: tac gia dong thoi la nguoi review cua chinh minh.")
        for r in people[1:]:
            if r not in AGENTS:
                problems.append(f"{rel}: reviewer {r!r} khong hop le.")
        if data["status"] not in STATUSES:
            problems.append(f"{rel}: status {data['status']!r} khong thuoc {STATUSES}.")
        if data["turn_role"] not in ROLES:
            problems.append(f"{rel}: turn_role {data['turn_role']!r} khong thuoc {ROLES}.")
        if data["turn"] not in people:
            problems.append(f"{rel}: turn {data['turn']!r} khong phai nguoi tham gia luong.")
        if data["turn_role"] == "author" and data["turn"] != data["author"]:
            problems.append(f"{rel}: turn_role la author nhung turn khong phai tac gia.")

        try:
            rnd = int(data["round"])
        except (TypeError, ValueError):
            problems.append(f"{rel}: round phai la so nguyen.")
            rnd = 0
        if rnd > MAX_ROUND and data["status"] == "open":
            problems.append(
                f"{rel}: da qua vong {MAX_ROUND} ma status van open. "
                "Het tran thi chuyen blocked va day diem mo len Tu."
            )

        if not (repo_root() / str(data["artifact"])).exists():
            if rnd == 1 and data["turn_role"] == "author":
                notes.append(f"{rel}: artifact chua ton tai, tac gia se tao o luot dau.")
            else:
                problems.append(f"{rel}: khong thay artifact {data['artifact']}.")

        for f in sorted(d.glob("*.md")):
            if f.name == "THREAD.md":
                continue
            m = FILE_RE.match(f.name)
            if not m:
                problems.append(
                    f"{rel}/{f.name}: sai dinh dang r<vong>-<NN>-<proposal|review|response>-<agent>.md")
                continue
            if m.group(4) not in people:
                problems.append(f"{rel}/{f.name}: {m.group(4)} khong tham gia luong nay.")
            if int(m.group(1)) > MAX_ROUND:
                problems.append(f"{rel}/{f.name}: vong {m.group(1)} vuot tran {MAX_ROUND}.")
            if parse_points_block(f.read_text(encoding="utf-8")) is None:
                problems.append(f"{rel}/{f.name}: thieu khoi ```points```.")

        open_pts = [p for p in read_points(text or "") if is_open(p["state"])]
        if data["status"] == "settled" and open_pts:
            problems.append(
                f"{rel}: status settled nhung con {len(open_pts)} diem mo "
                f"({', '.join(p['id'] for p in open_pts)})."
            )

    for n in notes:
        print(f"  ghi chu: {n}")
    if problems:
        print(f"\nthreads: {len(problems)} van de")
        for p in problems:
            print(f"  - {p}")
        return 1
    print(f"threads: khong phat hien van de ({len(threads)} luong)")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="command", required=True)

    p_new = sub.add_parser("new", help="mo mot luong review moi")
    p_new.add_argument("slug")
    p_new.add_argument("--artifact", required=True)
    p_new.add_argument("--author", required=True, choices=AGENTS)
    p_new.add_argument("--reviewers", required=True, help="vi du gemini,codex")
    p_new.add_argument("--question", required=True)
    p_new.add_argument("--step", help="so buoc trong bang o AGENTS.md muc 8")
    p_new.set_defaults(func=cmd_new)

    p_status = sub.add_parser("status", help="liet ke luong va diem con mo")
    p_status.add_argument("slug", nargs="?")
    p_status.set_defaults(func=cmd_status)

    p_next = sub.add_parser("next", help="in cau can dan cho agent toi luot")
    p_next.add_argument("slug")
    p_next.set_defaults(func=cmd_next)

    p_apply = sub.add_parser("apply", help="ap dung mot file vong: cap nhat bang diem va doi luot")
    p_apply.add_argument("slug")
    p_apply.add_argument("file", help="ten file vong, vi du r1-01-review-gemini.md")
    p_apply.set_defaults(func=cmd_apply)

    p_check = sub.add_parser("check", help="kiem tra tinh nhat quan cua cac luong")
    p_check.set_defaults(func=cmd_check)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.exit(main())
