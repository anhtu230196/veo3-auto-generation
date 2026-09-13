#!/usr/bin/env python3
"""Dien truong `at` cua moi shot trong .shots.json tu THOI GIAN TUNG CHU trong .en-orig.vtt.

SPEC-v2 muc 5b-bis chot viec nay tu 2026-09-11 nhung chua ai cai: `build_image_prompts.py`
van chi chep lai `at` do nguoi go. Ly do phai co script nay, chep nguyen tu spec:

    hai vi du trong chinh spec do da sai — A1-12 go 0:46 trong khi `guarded` bat dau o
    0:36.960, A1-13 go 0:50 trong khi `found` o 0:44.080. Lech 9 va 6 giay, gap doi toi gap
    ba muc sai so +-3 giay ma spec cam ket. Hau qua neu dung theo: hinh nguoi gac hien len
    luc loi da chuyen sang phat hien thi the.

Bo kiem "cue co nam trong segment khong" cua builder VAN CHO CA HAI QUA — nen no khong du.

    python scripts/fill_at_from_vtt.py image-prompts/A1.shots.json
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WORD_RE = re.compile(r"[A-Za-z0-9'\u00c0-\u024f]+")
CUE_RE = re.compile(r"^(\d\d):(\d\d):(\d\d)\.(\d+)\s+-->")
TAG_RE = re.compile(r"<(\d\d):(\d\d):(\d\d)\.(\d+)>")


def vtt_words(path: Path) -> list[tuple[float, str]]:
    """-> [(giay, chu)] theo thu tu xuat hien, da bo cac dong lap cua phu de tu dong."""
    out: list[tuple[float, str]] = []
    cur: float | None = None
    for line in path.read_text(encoding="utf-8").splitlines():
        m = CUE_RE.match(line)
        if m:
            cur = int(m[1]) * 3600 + int(m[2]) * 60 + int(m[3]) + int(m[4]) / 1000
            continue
        if cur is None or not line.strip():
            continue
        if line.startswith(("WEBVTT", "Kind:", "Language:", "NOTE")):
            continue
        t = cur
        for tok in re.split(r"(<\d\d:\d\d:\d\d\.\d+>)", line):
            mt = TAG_RE.match(tok)
            if mt:
                t = int(mt[1]) * 3600 + int(mt[2]) * 60 + int(mt[3]) + int(mt[4]) / 1000
                continue
            for w in WORD_RE.findall(re.sub(r"</?c[^>]*>", " ", tok)):
                out.append((t, w.lower()))
    seen, uniq = set(), []
    for t, w in out:
        k = (round(t, 2), w)
        if k in seen:
            continue
        seen.add(k)
        uniq.append((t, w))
    return uniq


def find_at(words: list[tuple[float, str]], cue: str) -> str | None:
    toks = [w.lower() for w in WORD_RE.findall(cue)]
    if not toks:
        return None
    for i in range(len(words) - len(toks) + 1):
        if [w for _, w in words[i:i + len(toks)]] == toks:
            s = int(words[i][0])
            return f"{s // 60}:{s % 60:02d}"
    return None


def main() -> int:
    if len(sys.argv) < 2:
        print("Dung: python scripts/fill_at_from_vtt.py <file.shots.json>")
        return 1
    p = Path(sys.argv[1])
    data = json.loads(p.read_text(encoding="utf-8"))

    vid = data["video"]["id"]
    folder = (ROOT / data["video"]["transcript"]).parent
    cands = sorted(folder.glob(f"*[[]{vid}[]].en-orig.vtt")) or sorted(folder.glob("*.en-orig.vtt"))
    if not cands:
        print(f"LOI: khong thay .en-orig.vtt trong {folder}")
        return 1
    words = vtt_words(cands[0])
    print(f"{cands[0].name}: {len(words)} chu co moc thoi gian")

    missing = []
    for seg in data["segments"]:
        for shot in seg["shots"]:
            at = find_at(words, shot["cue"])
            if at is None:
                missing.append(f"{shot['id']} ({shot['cue']!r})")
                continue
            shot["at"] = at
            print(f"  {shot['id']:<7} {at:>5}  <- {shot['cue']!r}")
    p.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    if missing:
        print("KHONG tra duoc moc cho: " + ", ".join(missing))
        return 1
    print(f"-> da dien `at` cho {p.name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
