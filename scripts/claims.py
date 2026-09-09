#!/usr/bin/env python3
"""Quan ly va kiem tra file claim trong coordination/claims/.

Dung chung cho moi agent (Codex, Claude, Gemini). Xem AGENTS.md muc 4.

    python scripts/claims.py check
    python scripts/claims.py list
    python scripts/claims.py new NET-0007 --agent codex --branch codex/net-0007 --task "Nghien cuu"
"""
from __future__ import annotations

import argparse
import re
import subprocess
import sys
from datetime import date, datetime
from pathlib import Path

AGENTS = {"codex", "claude", "gemini"}
STATUSES = {"active", "done", "released"}
ID_RE = re.compile(r"^(NET-\d{4}|sys-[a-z0-9][a-z0-9-]*)$")
REQUIRED = ["id", "agent", "branch", "status", "opened", "updated"]
STALE_DAYS = 7


def repo_root() -> Path:
    return Path(__file__).resolve().parents[1]


def default_branch() -> str:
    """Ten nhanh mac dinh cua repo — main o repo nay, master o repo kia."""
    try:
        out = subprocess.run(
            ["git", "symbolic-ref", "--short", "refs/remotes/origin/HEAD"],
            cwd=repo_root(), capture_output=True, text=True, timeout=10)
        if out.returncode == 0 and out.stdout.strip():
            return out.stdout.strip().split("/")[-1]
    except (OSError, subprocess.SubprocessError):
        pass
    return "main"


def claims_dir() -> Path:
    return repo_root() / "coordination" / "claims"


def parse_front_matter(text: str):
    """Doc frontmatter YAML phang. Chi ho tro key: value va danh sach '- muc'."""
    if not text.startswith("---"):
        return None, "khong co frontmatter mo dau bang ---"
    end = text.find("\n---", 3)
    if end == -1:
        return None, "frontmatter khong duoc dong bang ---"
    data = {}
    key = None
    for raw in text[3:end].splitlines():
        line = raw.rstrip()
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if line.lstrip().startswith("- ") and key:
            data.setdefault(key, []).append(line.lstrip()[2:].strip())
            continue
        if ":" not in line:
            return None, f"dong khong doc duoc trong frontmatter: {line!r}"
        key, _, value = line.partition(":")
        key = key.strip()
        value = value.strip()
        data[key] = value if value else []
    return data, None


def parse_day(value):
    try:
        return datetime.strptime(str(value), "%Y-%m-%d").date()
    except ValueError:
        return None


def load_claims():
    out = []
    for path in sorted(claims_dir().glob("*.md")):
        if path.name.startswith("_"):
            continue
        data, err = parse_front_matter(path.read_text(encoding="utf-8"))
        out.append((path, data, err))
    return out


def cmd_check(args) -> int:
    problems = []
    notes = []
    active_by_id = {}
    today = date.today()

    if not claims_dir().is_dir():
        print("claims: chua co thu muc coordination/claims/")
        return 0

    for path, data, err in load_claims():
        rel = path.relative_to(repo_root()).as_posix()
        if err:
            problems.append(f"{rel}: {err}")
            continue

        missing = [k for k in REQUIRED if not data.get(k)]
        if missing:
            problems.append(f"{rel}: frontmatter thieu {', '.join(missing)}.")
            continue

        cid = str(data["id"])
        if not ID_RE.match(cid):
            problems.append(f"{rel}: id {cid!r} phai la NET-xxxx hoac sys-<slug>.")
        if path.stem != cid:
            problems.append(f"{rel}: ten file phai trung id ({cid}.md).")
        if data["agent"] not in AGENTS:
            problems.append(f"{rel}: agent {data['agent']!r} khong thuoc {sorted(AGENTS)}.")
        status = str(data["status"])
        if status not in STATUSES:
            problems.append(f"{rel}: status {status!r} khong thuoc {sorted(STATUSES)}.")
        if not str(data["branch"]).startswith(tuple(f"{a}/" for a in AGENTS)):
            problems.append(
                f"{rel}: branch {data['branch']!r} phai bat dau bang codex/, claude/ hoac gemini/."
            )

        opened = parse_day(data["opened"])
        updated = parse_day(data["updated"])
        for label, value in (("opened", opened), ("updated", updated)):
            if value is None:
                problems.append(f"{rel}: {label} phai theo dang YYYY-MM-DD.")
        if opened and updated and updated < opened:
            problems.append(f"{rel}: updated som hon opened.")

        if status == "active":
            if cid in active_by_id:
                problems.append(
                    f"{cid}: hai claim active cung luc — {active_by_id[cid]} va {rel}. "
                    "Chi mot agent duoc giu mot ma."
                )
            else:
                active_by_id[cid] = rel
            if updated and (today - updated).days > STALE_DAYS:
                notes.append(
                    f"{rel}: claim active da {(today - updated).days} ngay khong cap nhat. "
                    "Coi nhu nguoi; hoi nguoi dung truoc khi tiep quan."
                )

    if problems:
        for note in notes:
            print(f"  ghi chu: {note}")
        print(f"\nclaims: {len(problems)} van de")
        for p in problems:
            print(f"  - {p}")
        return 1
    for note in notes:
        print(f"  ghi chu: {note}")
    print(f"claims: khong phat hien van de ({len(active_by_id)} claim dang active)")
    return 0


def cmd_list(args) -> int:
    rows = []
    for path, data, err in load_claims():
        if err or not data:
            rows.append((path.stem, "?", "?", f"loi: {err}"))
            continue
        if args.active and data.get("status") != "active":
            continue
        rows.append((str(data.get("id")), str(data.get("agent")),
                     str(data.get("status")), str(data.get("branch"))))
    if not rows:
        print("khong co claim nao")
        return 0
    width = max(len(r[0]) for r in rows)
    for cid, agent, status, branch in rows:
        print(f"{cid:<{width}}  {agent:<7} {status:<9} {branch}")
    return 0


def cmd_new(args) -> int:
    cid = args.id
    if not ID_RE.match(cid):
        sys.exit(f"id {cid!r} phai la NET-xxxx hoac sys-<slug>.")
    if args.agent not in AGENTS:
        sys.exit(f"agent phai thuoc {sorted(AGENTS)}.")
    dest = claims_dir() / f"{cid}.md"
    if dest.exists() and not args.force:
        sys.exit(f"{dest.relative_to(repo_root()).as_posix()} da ton tai. Doc no truoc khi ghi de.")
    claims_dir().mkdir(parents=True, exist_ok=True)
    today = date.today().isoformat()
    scope = args.scope or []
    scope_block = "\n".join(f"  - {s}" for s in scope) if scope else "  - (ghi ro duong dan)"
    dest.write_text(
        f"---\n"
        f"id: {cid}\n"
        f"agent: {args.agent}\n"
        f"branch: {args.branch}\n"
        f"status: active\n"
        f"opened: {today}\n"
        f"updated: {today}\n"
        f"scope:\n{scope_block}\n"
        f"---\n\n"
        f"# {cid} — {args.task}\n\n"
        f"**Làm gì:** {args.task}\n\n"
        f"**Không đụng tới:** (ghi rõ phần agent khác vẫn sửa song song được)\n\n"
        f"**Ghi chú:** \n",
        encoding="utf-8",
    )
    print(f"da tao {dest.relative_to(repo_root()).as_posix()}")
    print(f"Commit rieng file nay va day len {default_branch()} truoc khi bat dau lam viec nang.")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    sub = parser.add_subparsers(dest="command", required=True)

    p_check = sub.add_parser("check", help="kiem tra dinh dang va chong claim trung")
    p_check.set_defaults(func=cmd_check)

    p_list = sub.add_parser("list", help="liet ke claim")
    p_list.add_argument("--active", action="store_true", help="chi hien claim dang active")
    p_list.set_defaults(func=cmd_list)

    p_new = sub.add_parser("new", help="tao mot claim moi")
    p_new.add_argument("id", help="NET-0007 hoac sys-<slug>")
    p_new.add_argument("--agent", required=True, choices=sorted(AGENTS))
    p_new.add_argument("--branch", required=True, help="vi du codex/net-0007-research")
    p_new.add_argument("--task", required=True, help="mo ta viec trong mot dong")
    p_new.add_argument("--scope", action="append", help="duong dan nam trong pham vi (lap lai duoc)")
    p_new.add_argument("--force", action="store_true", help="ghi de claim da co")
    p_new.set_defaults(func=cmd_new)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.exit(main())
