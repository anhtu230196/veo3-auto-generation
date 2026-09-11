#!/usr/bin/env python3
"""Doi phu de .vtt cua YouTube thanh transcript sach, co moc thoi gian.

Phu de tu dong cua YouTube la kieu "cuon": moi cue lap lai gan het cue truoc
roi them mot dong moi. Doc thang thi moi cau bi lap 2-3 lan (xem
narration-per-frame.txt cu). Script nay bo phan lap, gop lai thanh khoi.

    python scripts/vtt_to_transcript.py <file.vtt> [--block 15] [-o out.md]
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

TAG_RE = re.compile(r"<[^>]*>")
TIME_RE = re.compile(r"^(\d{2}):(\d{2}):(\d{2})\.(\d{3})\s+-->\s+")


def secs(h: str, m: str, s: str, ms: str) -> float:
    return int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000


def parse(path: Path):
    """Tra ve [(giay, dong)] da bo phan lap cua phu de cuon."""
    out, seen_tail = [], []
    start = None
    for raw in path.read_text(encoding="utf-8", errors="replace").splitlines():
        line = raw.strip()
        m = TIME_RE.match(line)
        if m:
            start = secs(*m.groups())
            continue
        if not line or line.startswith(("WEBVTT", "Kind:", "Language:", "NOTE")):
            continue
        text = TAG_RE.sub("", line).strip()
        if not text or start is None:
            continue
        # Phu de cuon: dong nao da xuat hien o cue truoc thi bo.
        if text in seen_tail:
            continue
        seen_tail.append(text)
        del seen_tail[:-6]
        out.append((start, text))
    return out


def blocks(rows, span: float):
    cur, cur_t = [], None
    for t, text in rows:
        if cur_t is None:
            cur_t = t
        if t - cur_t >= span and cur:
            yield cur_t, " ".join(cur)
            cur, cur_t = [], t
        cur.append(text)
    if cur:
        yield cur_t, " ".join(cur)


def stamp(t: float) -> str:
    return f"{int(t) // 60}:{int(t) % 60:02d}"


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("vtt")
    ap.add_argument("--block", type=float, default=15.0,
                    help="gop bao nhieu giay vao mot khoi (mac dinh 15)")
    ap.add_argument("-o", "--out")
    args = ap.parse_args()

    src = Path(args.vtt)
    if not src.exists():
        sys.exit(f"khong tim thay {src}")
    rows = parse(src)
    if not rows:
        sys.exit(f"{src} khong co dong phu de nao doc duoc")
    lines = [f"[{stamp(t)}] {text}" for t, text in blocks(rows, args.block)]
    body = "\n\n".join(lines) + "\n"
    if args.out:
        Path(args.out).write_text(body, encoding="utf-8")
        print(f"{len(lines)} khoi -> {args.out}")
    else:
        sys.stdout.write(body)
    return 0


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.exit(main())
