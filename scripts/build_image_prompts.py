#!/usr/bin/env python3
"""Doc image-prompts/SHOT-LIST.md, noi khoi style vao cuoi tung dong, xuat file.

Cot `ve gi` trong SHOT-LIST.md la prompt THO: chi noi ve cai gi, khong tap
phong cach. Script nay noi STYLE_BLOCK vao cuoi moi prompt tho. De khoi style
o day thay vi go lai trong tung dong vi hai ly do: sua mot cho la doi ca lo,
va dong trong SHOT-LIST van doc duoc bang mat khi review.

    python scripts/build_image_prompts.py            # xuat ra image-prompts/
    python scripts/build_image_prompts.py --check    # chi dem, khong ghi
    python scripts/build_image_prompts.py --stdout   # in ra man hinh
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

# Khoi nay Tu chot, chep nguyen van. Doi mot chu o day la doi ca hai lo anh,
# nen dung sua no de "thu cho hay hon" ma khong bao Tu.
STYLE_BLOCK = (
    "Use a white background, and make it look like it was drawn in an old "
    "computer painting program with a mouse. It should be vaguely similar but "
    "also not really, kind of matching but also off in a confusing, awkward "
    "way, with that low-quality pixel-by-pixel feel that really emphasizes how "
    "ridiculously bad it is. Actually, you know what, whatever, just draw it "
    "however you want."
)

ROOT = Path(__file__).resolve().parents[1]
SHOT_LIST = ROOT / "image-prompts" / "SHOT-LIST.md"

VIDEO_RE = re.compile(r"^##\s+Video\s+([A-Z])\s+[-—]\s+(.+?)\s*$")
ID_RE = re.compile(r"^`([A-Za-z0-9_-]+)`\s+·")
ROW_RE = re.compile(r"^\|\s*([A-Z]\d+-\d+)\s*\|\s*([\d:]+)\s*\|\s*(.+?)\s*\|\s*$")


def parse(path: Path):
    """-> [{letter, title, vid, rows: [(ma, moc, prompt_tho)]}]"""
    videos, cur = [], None
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.rstrip()
        m = VIDEO_RE.match(line)
        if m:
            cur = {"letter": m.group(1), "title": m.group(2), "vid": None, "rows": []}
            videos.append(cur)
            continue
        if cur and cur["vid"] is None:
            m = ID_RE.match(line)
            if m:
                cur["vid"] = m.group(1)
                continue
        m = ROW_RE.match(line)
        if m and cur is not None:
            code, stamp, subject = m.groups()
            if code.startswith(cur["letter"]):
                cur["rows"].append((code, stamp, subject))
    return videos


def full_prompt(subject: str) -> str:
    """Noi khoi style. Dam bao dung mot dau cham truoc khi noi."""
    s = subject.strip().rstrip(".")
    return f"{s}. {STYLE_BLOCK}"


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--shot-list", default=str(SHOT_LIST))
    ap.add_argument("--check", action="store_true", help="chi dem, khong ghi file")
    ap.add_argument("--stdout", action="store_true", help="in ra man hinh")
    args = ap.parse_args()

    src = Path(args.shot_list)
    if not src.exists():
        sys.exit(f"khong tim thay {src}")
    videos = parse(src)
    if not videos:
        sys.exit(f"{src}: khong doc duoc muc '## Video X — ...' nao")

    total, problems = 0, []
    for v in videos:
        if not v["vid"]:
            problems.append(f"Video {v['letter']}: thieu dong id dang `<id>` · ...")
        if not v["rows"]:
            problems.append(f"Video {v['letter']}: khong co dong nao")
        seen = set()
        for code, _, subject in v["rows"]:
            if code in seen:
                problems.append(f"{code}: ma bi trung")
            seen.add(code)
            if not subject or subject.startswith("("):
                problems.append(f"{code}: cot 've gi' con trong")
        total += len(v["rows"])

    if problems:
        for p in problems:
            print(f"LOI: {p}")
        return 1

    for v in videos:
        print(f"Video {v['letter']} ({v['vid']}): {len(v['rows'])} anh — {v['title']}")
        if args.check:
            continue
        lines_txt = [full_prompt(s) for _, _, s in v["rows"]]
        lines_tsv = [f"{c}\t{t}\t{full_prompt(s)}" for c, t, s in v["rows"]]
        if args.stdout:
            for code, line in zip((c for c, _, _ in v["rows"]), lines_txt):
                print(f"--- {code}\n{line}\n")
            continue
        out_dir = src.parent
        (out_dir / f"{v['vid']}.prompts.txt").write_text(
            "\n\n".join(lines_txt) + "\n", encoding="utf-8")
        (out_dir / f"{v['vid']}.prompts.tsv").write_text(
            "ma\tmoc\tprompt\n" + "\n".join(lines_tsv) + "\n", encoding="utf-8")
        print(f"  -> {v['vid']}.prompts.txt · {v['vid']}.prompts.tsv")

    print(f"Tong: {total} anh.")
    return 0


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.exit(main())
