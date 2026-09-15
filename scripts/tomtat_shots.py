#!/usr/bin/env python3
"""Sinh BANG TOM TAT "doan loi ke -> hinh se tao" tu mot <id>.shots.json, de Tu nhin mot luot.

Tu yeu cau 2026-09-13: "gui toi bang tom tat cac prompt do se tao hinh gi tuong ung voi doan nao".
Ban review (scripts/review_shots.py) in prompt nguyen van tung shot — qua dai de nhin tong the.
Bang nay moi dong mot shot (hoac mot cho DUNG LAI anh co san), xep theo thu tu cau trong loi ke:

    cau | cum loi ke (cue) | shot | hinh se tao (truong `tomTat`) | trang thai

Doc them hai khoi cua .shots.json:
- `tomTat` tren tung shot — mot dong tieng Viet. Thieu thi lay cau dau cua `anhSeRa`.
- `_dungLai` — cau loi ke khong tao anh moi ma dung lai anh da co (skill 4d-bis phan 3).

    python scripts/tomtat_shots.py <file>.shots.json [--flow-status output/c1-flow-status.json]

Ra file <file>.tomtat.md canh file .shots.json.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TS_RE = re.compile(r"\[\d+:\d{2}\]")


def norm(s: str) -> str:
    return " ".join(TS_RE.sub(" ", s).split())


def cell(s: str) -> str:
    return s.replace("|", "/").replace("\n", " ")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("shots")
    ap.add_argument("--flow-status", help="JSON {result: {id: {found, name}}} tra thang tren Flow")
    args = ap.parse_args()

    path = Path(args.shots)
    data = json.loads(path.read_text(encoding="utf-8"))
    transcript = norm((ROOT / data["video"]["transcript"]).read_text(encoding="utf-8"))
    shots = [s for seg in data["segments"] for s in seg["shots"]]

    flow = {}
    if args.flow_status:
        flow = json.loads(Path(args.flow_status).read_text(encoding="utf-8")).get("result", {})

    def status(s: dict) -> str:
        r = flow.get(s["id"])
        if r and r.get("found"):
            return "✅ đã có" if r.get("name") in (None, s["outName"]) else "🔁 tạo lại (đổi tên)"
        if s.get("choTuLieu"):
            return "⏳ chờ tư liệu"
        return "⏸ chưa tạo"

    def summary(s: dict) -> str:
        if s.get("tomTat"):
            return s["tomTat"]
        first = (s.get("anhSeRa") or "").split(". ")[0]
        return first or s["outName"]

    rows = []  # (vi tri cau, vi tri cue, thu tu goc, dict)
    for n, s in enumerate(shots):
        cue_pos = transcript.find(norm(s["cue"]))
        rows.append((transcript.find(norm(s["at"])), cue_pos, n, {
            "at": s["at"], "cue": s["cue"], "ma": s["id"], "hinh": summary(s), "tt": status(s)}))
    for n, r in enumerate(data.get("_dungLai", [])):
        rows.append((transcript.find(norm(r["at"])), transcript.find(norm(r["cue"])), 10_000 + n, {
            "at": r["at"], "cue": r["cue"], "ma": "♻️ " + ", ".join(r["dungLai"]),
            "hinh": "dùng lại: " + "; ".join(summary(next(x for x in shots if x["id"] == i)) for i in r["dungLai"]),
            "tt": "♻️ dùng lại"}))
    bad = [r[3]["ma"] for r in rows if r[0] < 0]
    if bad:
        sys.exit(f"`at` khong khop transcript: {bad}")
    rows.sort(key=lambda r: (r[0], r[1], r[2]))

    title = data.get("video", {}).get("title", path.stem)
    n_shot = len(shots)
    count = lambda key: sum(1 for s in shots if status(s).startswith(key))
    L = [
        f"# Tóm tắt ảnh — {title}",
        "",
        f"Sinh bằng `scripts/tomtat_shots.py` từ `{path.name}`. Xếp theo thứ tự câu lời kể; chữ in đậm trong cột *Cụm lời kể* là `cue`.",
        "Prompt nguyên văn và mô tả đầy đủ: file `.review.md` cùng thư mục.",
        "",
        f"**{n_shot} shot** — ✅ đã có {count('✅')} · 🔁 tạo lại {count('🔁')} · ⏳ chờ tư liệu {count('⏳')} · "
        f"⏸ chưa tạo {count('⏸')} · ♻️ {len(data.get('_dungLai', []))} chỗ dùng lại ảnh có sẵn.",
        "",
        "| Câu | Cụm lời kể | Shot | Hình sẽ tạo | Trạng thái |",
        "|---|---|---|---|---|",
    ]
    last_at, k = None, 0
    for _, _, _, r in rows:
        if r["at"] != last_at:
            k += 1
            last_at = r["at"]
            i = r["at"].find(r["cue"])
            shown = r["at"][:i] + "**" + r["cue"] + "**" + r["at"][i + len(r["cue"]):] if i >= 0 else r["at"]
            L.append(f"| {k} | {cell(shown)} | {r['ma']} | {cell(r['hinh'])} | {r['tt']} |")
        else:
            L.append(f"| ↳ | **{cell(r['cue'])}** | {r['ma']} | {cell(r['hinh'])} | {r['tt']} |")

    out = path.with_name(path.name.replace(".shots.json", ".tomtat.md"))
    out.write_text("\n".join(L) + "\n", encoding="utf-8", newline="\n")
    print(f"-> {out} | {n_shot} shot, {len(data.get('_dungLai', []))} dung lai, {k} cau")
    return 0


if __name__ == "__main__":
    sys.exit(main())
