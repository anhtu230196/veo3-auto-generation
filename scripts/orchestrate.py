#!/usr/bin/env python3
"""Chay luong review tu dong bang CLI cua tung agent, khong goi API.

Moi luot goi CLI tuong ung o che do headless, lay stdout lam file vong, roi
cap nhat THREAD.md. Luot review chay che do chi doc; chi luot tac gia moi duoc
sua artifact. Xem AGENTS.md muc 8.

    python scripts/orchestrate.py start "<yeu cau>" # mo luong moi roi chay luon
    python scripts/orchestrate.py doctor            # CLI nao dung duoc
    python scripts/orchestrate.py doctor --probe    # goi thu mot cau ngan
    python scripts/orchestrate.py turn <slug>       # chay dung mot luot
    python scripts/orchestrate.py run <slug>        # chay den khi hoi tu
"""
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import signal
import subprocess
import sys
import tempfile
import time
import unicodedata
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import thread as th  # noqa: E402

CONFIG = Path(__file__).resolve().parents[1] / "coordination" / "agents.json"
MAX_TURNS = 12

# Dau hieu het quota / bi chan toc do trong dau ra cua CLI. Phan biet voi loi
# that vi cach xu ly khac han: doi, doi tai khoan, hoac de agent khac nhan luot.
QUOTA_MARKS = ("429", "quota", "rate limit", "ratelimit", "resource_exhausted",
               "resource exhausted", "usage limit", "overloaded", "too many requests")


def looks_like_quota(*chunks: str) -> bool:
    blob = " ".join(c or "" for c in chunks).lower()
    return any(m in blob for m in QUOTA_MARKS)

# Luat review duoc nhung thang vao prompt thay vi bat agent doc lai AGENTS.md
# va SKILL.md moi luot. Lan chay that dau tien mat hon 600s phan lon vi doc
# lai tai lieu; noi dung can thiet ngan hon nhieu so voi ca hai file do.
PREAMBLE_READ = """Ban dang chay o che do TU DONG, khong co nguoi doc man hinh cua ban.

Luat cua che do nay:
- KHONG tao hay sua bat ky file nao. Ban chi doc.
- KHONG sua THREAD.md. Orchestrator lo viec do.
- In TOAN BO noi dung file vong ra stdout, khong in gi khac ngoai no.
- Doc vua du de tra loi. Dung doc lai AGENTS.md hay SKILL.md — luat can
  thiet nam ngay duoi day.

LUAT REVIEW

Duoc neu: loi su that; suy dien trinh bay nhu su that; thoai hoac canh khong
ai chung kien duoc dung thanh su that; cau hoi mo ra ma khong dong lai; loi
giai xuat hien truoc khi manh moi duoc dat; trinh tu tiet lo hong; chi tiet
khong phuc vu cau chuyen hoac lap chuc nang; trung voi chuyen da co; rui ro
quang cao hoac phap ly.

KHONG duoc neu: "toi se viet khac" — khac gu khong phai loi; doi viet lai
toan bo khi chi mot doan co van de; neu lai diem da chot ma khong co chung
cu moi; gop y ve thu thuoc buoc sau.

Moi diem phai co du ba phan:
  CHO NAO      file:dong
  VAN DE GI    noi dung sai, kem claim_id / source_id neu co
  CAN GI DE DONG   tac gia lam gi thi diem nay chot

Thieu phan thu ba thi tac gia khong biet duong thoat, va luong se ping-pong.

Nhan moi diem: CHAN (khong di tiep buoc sau duoc) / SUA / HOI / OK.

Cuoi file bat buoc co mot muc "Toi da khong kiem cai gi". Review nua voi ma
trinh bay nhu da doc het se lam agent sau tin nham.

"""

PREAMBLE_WRITE = """Ban dang chay o che do TU DONG, khong co nguoi doc man hinh cua ban.

Luat cua che do nay:
- Ban DUOC sua file artifact neu luot nay yeu cau sua.
- KHONG tao file vong tren dia va KHONG sua THREAD.md. Orchestrator lo viec do.
- In TOAN BO noi dung file vong ra stdout, khong in gi khac ngoai no.
- Doc vua du de tra loi. Dung doc lai AGENTS.md hay SKILL.md.

LUAT PHAN BAC

Tra loi TUNG diem dang mo. Khong im lang bo qua, khong sua lay le cho diem
bien mat. Voi moi diem, chon mot:

  CHAP NHAN  sua artifact, ghi ro sua o dau va sua the nao
  PHAN BAC   chi bang mot trong bon ly do sau, kem can cu:
               - nguon noi khac dieu nguoi review tuong (trich nguon + vi tri)
               - nam ngoai pham vi buoc nay (noi ro buoc nao se lo)
               - da co cho khac xu ly (chi ra cho do)
               - lua chon ke chuyen trong vung cho phep (noi ro vi sao day
                 khong phai loi su that hay loi cau truc)
  CHUA CHAC  noi thang la chua chac va de nghi day len Tu. Day la lua chon
             hop le, khong phai thua.

"""

POINTS_CONTRACT = """

Khoi points o cuoi file, dinh dang moi dong: D<so> | <trang thai> | <cho> | <tom tat>

```points
D01 | mở | scripts/vi-du.md:44 | Gan trang thai tam ly khong co nguon
```

Trang thai hop le, chep dung nguyen van mot trong cac chuoi sau:
  mở
  đã sửa ở v<N>
  tác giả phản bác — chờ <agent>
  chốt: đã sửa
  chốt: giữ nguyên
  đẩy lên Tú
"""


# Dat o CUOI prompt. Hai lan chay dau tien agent deu viet bao cao ve tinh
# huong cua no ("toi bi chan quyen ghi, file nam o scratchpad") thay vi noi
# dung file vong. No khong co cho hop le de bao viec bi chan, nen no chiem
# luon cho cua san pham. Cho no mot cho — ben trong file vong.
OUTPUT_CONTRACT = """

===============================================================================
HOP DONG DAU RA — doc ky, day la cho hai luot truoc da lam sai

STDOUT CUA BAN CHINH LA FILE VONG. Khong phai bao cao ve file vong.

- Ky tu dau tien ban in ra phai la ky tu dau tien cua file vong (dau '#').
- KHONG mo dau bang loi giai thich, loi chao, hay tom tat viec ban vua lam.
- KHONG tao file. Khong Write, khong chep ra scratchpad. Orchestrator ghi ho.
- KHONG ke chuyen ban lam duoc gi hay bi chan gi o ngoai file vong.

Bi chan quyen thi ghi vao muc "Toi da khong kiem cai gi" BEN TRONG file vong,
noi ro cong cu nao bi chan va do do ket luan nao chua duoc kiem. Do la thong
tin that va agent sau can biet — nhung no thuoc trong file, khong thay the file.

Ket thuc bang khoi ```points```. Thieu khoi do thi ca luot nay bi bo.
===============================================================================
"""


def load_config() -> dict:
    if not CONFIG.exists():
        sys.exit(f"khong tim thay {CONFIG}")
    return json.loads(CONFIG.read_text(encoding="utf-8"))["agents"]


PROBE_TIMEOUT = 60
IS_WIN = os.name == "nt"


def kill_tree(proc: subprocess.Popen) -> None:
    """Giet ca cay tien trinh. Giet moi tien trinh cha khong du: cac CLI la
    shim goi node, va con chau con song se giu ong dan mai."""
    if IS_WIN:
        subprocess.run(["taskkill", "/F", "/T", "/PID", str(proc.pid)],
                       capture_output=True)
        return
    try:
        os.killpg(os.getpgid(proc.pid), signal.SIGKILL)
    except (ProcessLookupError, PermissionError):
        proc.kill()


def run_cli(spec: dict, prompt: str, write: bool, timeout: int | None = None):
    """Goi CLI, tra ve (ma thoat, stdout, stderr, giay)."""
    template = spec["write_cmd" if write else "cmd"]
    cmd = [prompt if part == "{prompt}" else part.replace("{prompt}", prompt)
           for part in template]
    # Tren Windows, subprocess khong tu ap dung PATHEXT: "gemini" khong chay,
    # phai la duong dan day du toi gemini.CMD.
    resolved = shutil.which(cmd[0])
    if resolved:
        cmd[0] = resolved
    # Mot so CLI in lan nhieu ra stdout (codex: "web search:", "tokens used",
    # va lap lai ca cau tra loi). Neu co co lay ket qua ra file thi dung no.
    out_file = None
    if spec.get("output_file_flag"):
        fd, path = tempfile.mkstemp(prefix="agentout-", suffix=".txt")
        os.close(fd)
        out_file = Path(path)
        cmd = cmd + [spec["output_file_flag"], str(out_file)]

    secs_cap = timeout or spec.get("timeout", 600)
    t0 = time.time()
    try:
        proc = subprocess.Popen(
            cmd, cwd=th.repo_root(),
            stdout=subprocess.PIPE, stderr=subprocess.PIPE,
            # Khong co stdin: cac CLI headless doi du lieu ong dan va treo
            # 3-30s neu de mac dinh.
            stdin=subprocess.DEVNULL,
            text=True, encoding="utf-8", errors="replace",
            **({} if IS_WIN else {"start_new_session": True}))
    except FileNotFoundError:
        if out_file:
            out_file.unlink(missing_ok=True)
        return 127, "", f"khong tim thay lenh {cmd[0]!r}", 0.0

    def finish(code, out, err):
        if out_file:
            try:
                content = out_file.read_text(encoding="utf-8", errors="replace")
                if content.strip():
                    out = content
            except OSError:
                pass
            out_file.unlink(missing_ok=True)
        return code, out or "", err or "", time.time() - t0

    try:
        out, err = proc.communicate(timeout=secs_cap)
        return finish(proc.returncode, out, err)
    except subprocess.TimeoutExpired:
        # subprocess.run(timeout=) mot minh khong du: no giet tien trinh cha
        # nhung con chau van giu ong dan, va communicate() cho vo han. Cac CLI
        # nay deu la shim goi node nen luon co con chau.
        kill_tree(proc)
        try:
            out, err = proc.communicate(timeout=15)
        except subprocess.TimeoutExpired:
            out, err = "", ""
        return finish(124, out, (err or "") + f"\nqua {secs_cap}s — da giet cay tien trinh")


def cmd_doctor(args) -> int:
    agents = load_config()
    bad = 0
    for name, spec in agents.items():
        installed = shutil.which(spec["bin"]) is not None
        mark = "co" if installed else "CHUA CAI"
        flag = "" if spec.get("verified") else "  [co CHUA KIEM CHUNG]"
        print(f"{name:<8} {mark:<9}{flag}")
        if spec.get("note"):
            print(f"         {spec['note']}")
        if not installed:
            bad += 1
            continue
        if args.probe:
            code, out, err, secs = run_cli(spec, "Tra loi dung mot tu: OK",
                                           write=False, timeout=PROBE_TIMEOUT)
            first = (out.strip().splitlines() or [""])[0][:60]
            if code == 0 and first:
                print(f"         probe: OK ({secs:.1f}s) — {first!r}")
            elif looks_like_quota(err, out):
                bad += 1
                print(f"         probe: HET QUOTA / BI CHAN TOC DO ({secs:.0f}s)")
            else:
                bad += 1
                msg = (err.strip().splitlines() or ["khong co stderr"])[-1][:120]
                print(f"         probe: LOI (ma {code}, {secs:.0f}s) — {msg}")
    return 1 if bad else 0


def one_turn(slug: str, agents: dict, dry: bool) -> str:
    """Chay mot luot. Tra ve status cua luong sau luot do."""
    d, data, text = th.read_thread(slug)
    t = th.turn_prompt(d, data)
    if t is None:
        print(f"Luong {slug} dang {data.get('status')} — khong co luot nao de chay.")
        return str(data.get("status"))

    agent = t["turn"]
    spec = agents.get(agent)
    if spec is None:
        sys.exit(f"coordination/agents.json khong co cau hinh cho {agent!r}.")
    if shutil.which(spec["bin"]) is None:
        print(f"DUNG: toi luot {agent} nhung chua cai {spec['bin']!r}.")
        print(f"      {spec.get('note', '')}")
        return "blocked-cli"

    preamble = PREAMBLE_WRITE if t["needs_write"] else PREAMBLE_READ
    # Hop dong dau ra dat cuoi cung: do la thu agent hay lam sai nhat.
    prompt = preamble + t["prompt"] + POINTS_CONTRACT + OUTPUT_CONTRACT

    print(f"--- vong {t['round']}/{th.MAX_ROUND} · {agent} ({t['role']}) "
          f"-> {t['file']} {'[sua duoc artifact]' if t['needs_write'] else '[chi doc]'}")
    if dry:
        print(prompt)
        return "dry"

    code, out, err, secs = run_cli(spec, prompt, write=t["needs_write"])
    if code != 0 or not out.strip():
        if looks_like_quota(err, out):
            print(f"    HET QUOTA hoac BI CHAN TOC DO sau {secs:.0f}s.")
            print("    Phan lon thoi gian do la CLI tu thu lai, khong phai lam viec.")
            print("    Doi quota hoi, doi tai khoan, hoac de agent khac nhan luot nay.")
            print("    THREAD.md khong bi doi — chay lai lenh nay sau la duoc.")
            return "quota"
        print(f"    LOI: ma thoat {code} sau {secs:.0f}s")
        for line in (err.strip().splitlines() or ["khong co stderr"])[-5:]:
            print(f"    {line[:160]}")
        return "error"

    t["path"].write_text(out, encoding="utf-8")
    print(f"    da ghi {t['path'].relative_to(th.repo_root()).as_posix()} ({secs:.0f}s)")

    block = th.parse_points_block(out)
    if block is None or isinstance(block, str):
        reason = block if isinstance(block, str) else "khong co khoi ```points```"
        print(f"    KHONG AP DUNG DUOC: {reason}")
        print("    File vong da giu lai. Sua tay roi chay: "
              f"python scripts/thread.py apply {slug} {t['file']}")
        return "needs-human"

    new_text, notes, status = th.advance(
        d, data, text, agent, block, bump_version=(t["kind"] == "response"))
    (d / "THREAD.md").write_text(new_text, encoding="utf-8")
    for n in notes:
        print(f"    ghi chu: {n}")
    print(f"    {len(block)} diem · luong -> {status}")
    return status


def cmd_turn(args) -> int:
    status = one_turn(args.slug, load_config(), args.dry_run)
    return 0 if status in ("open", "settled", "dry") else 1


def cmd_run(args) -> int:
    agents = load_config()
    for i in range(args.max_turns):
        status = one_turn(args.slug, agents, dry=False)
        if status != "open":
            print(f"\nDung o luot {i + 1}: {status}")
            if status == "settled":
                print("Luong da chot. Doc lai cac file vong truoc khi tin ket qua.")
            elif status == "blocked":
                print("Con diem mo sau khi het tran vong — can Tu quyet.")
            elif status == "quota":
                print("Luong giu nguyen trang thai. Chay lai `run` sau khi quota hoi.")
            return 0 if status == "settled" else 1
    print(f"\nDung vi cham tran {args.max_turns} luot.")
    return 1


def slugify(text: str, limit: int = 48) -> str:
    """Bo dau tieng Viet, con lai chu thuong va gach ngang."""
    s = text.replace("đ", "d").replace("Đ", "d")
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = re.sub(r"[^A-Za-z0-9]+", "-", s).strip("-").lower()
    if len(s) > limit:
        s = s[:limit].rsplit("-", 1)[0]
    return s or "luong"


def cmd_start(args) -> int:
    """Mot cau yeu cau -> mot luong review -> chay den khi hoi tu."""
    topic = args.topic.strip()
    slug = args.slug or slugify(topic)
    author = args.author
    reviewers = [a for a in th.AGENTS if a != author]
    artifact = args.artifact or f"coordination/drafts/{slug}.md"

    d = th.threads_dir() / slug
    if d.exists():
        print(f"Luong {slug} da co — chay tiep chu khong tao moi.")
    else:
        (th.repo_root() / artifact).parent.mkdir(parents=True, exist_ok=True)
        th.cmd_new(argparse.Namespace(
            slug=slug, author=author, reviewers=",".join(reviewers),
            artifact=artifact, step=args.step, question=topic))
        print(f"  tac gia: {author} · review: {', '.join(reviewers)}")
        print(f"  artifact: {artifact}")

    if args.no_run:
        print(f"Buoc tiep: python scripts/orchestrate.py run {slug}")
        return 0
    print()
    return cmd_run(argparse.Namespace(slug=slug, max_turns=args.max_turns))


def main() -> int:
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="command", required=True)

    p_start = sub.add_parser(
        "start", help="mo luong moi tu mot cau yeu cau roi chay luon")
    p_start.add_argument("topic", help='vi du: "xay dung kich ban chu de vu an X"')
    p_start.add_argument("--author", default="codex", choices=th.AGENTS,
                         help="agent viet ban dau tien (mac dinh codex)")
    p_start.add_argument("--artifact", help="mac dinh coordination/drafts/<slug>.md")
    p_start.add_argument("--slug", help="mac dinh suy ra tu topic")
    p_start.add_argument("--step", help="so buoc trong bang AGENTS.md muc 8")
    p_start.add_argument("--no-run", action="store_true",
                         help="chi tao luong, khong goi CLI")
    p_start.add_argument("--max-turns", type=int, default=MAX_TURNS)
    p_start.set_defaults(func=cmd_start)

    p_doc = sub.add_parser("doctor", help="kiem tra CLI nao dung duoc")
    p_doc.add_argument("--probe", action="store_true", help="goi thu mot cau ngan")
    p_doc.set_defaults(func=cmd_doctor)

    p_turn = sub.add_parser("turn", help="chay dung mot luot")
    p_turn.add_argument("slug")
    p_turn.add_argument("--dry-run", action="store_true", help="chi in prompt, khong goi CLI")
    p_turn.set_defaults(func=cmd_turn)

    p_run = sub.add_parser("run", help="chay den khi hoi tu hoac het tran")
    p_run.add_argument("slug")
    p_run.add_argument("--max-turns", type=int, default=MAX_TURNS)
    p_run.set_defaults(func=cmd_run)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.exit(main())
