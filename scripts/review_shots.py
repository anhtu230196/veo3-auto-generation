#!/usr/bin/env python3
"""Sinh ban REVIEW doc duoc tu mot <id>.shots.json + <id>.jobs.json, de Tu duyet TRUOC khi tao anh.

Tu chot 2026-09-13, giua me anh case Roanoke: "khoan chay tao anh, toi can review lai xem
prompt tao anh se tao nhung gi". File .shots.json kho doc bang mat — prompt that nam rai o
`draw` + khoi style + `styleByKind`, hoac o `mention` voi cac {{chip}}. Script nay in dung
prompt NGUYEN VAN ma builder gui Flow (doc tu .jobs.json), kem cau loi ke (`at`), y do, cach
sinh (chu + anh neo, hay chip @ tu asset nao), va trang thai da tao hay chua (doc tu log me).

    python scripts/build_image_prompts.py --shots <file>.shots.json      # sinh .jobs.json truoc
    python scripts/review_shots.py <file>.shots.json --log output/run-c1.log [--log ...]

Ra file <file>.review.md canh file .shots.json.

Vi sao doc prompt tu .jobs.json chu khong tu ghep lai: builder moi la noi quyet prompt that
(noi styleByKind vao cau mention, doi {{ten}} thanh chip). Ghep lai o day la tao ban thu hai
co the lech ban that — dung cai bay D08 cua build_image_prompts.py.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BY_KIND = ROOT / "input" / "style-ref" / "_anchors" / "by-kind.json"


def prompt_hash(prompt: str) -> str:
    """Dau van tay cua prompt NGUYEN VAN trong .jobs.json — ghi vao `anhSeRaHash` luc viet mo ta."""
    return hashlib.sha1(prompt.encode("utf-8")).hexdigest()[:12]


def read_status(log_files: list[str]) -> dict[str, str]:
    """-> {shot_id: trang thai}. Log sau ghi de log truoc, tru khi log truoc da co ✅."""
    status: dict[str, str] = {}
    for lf in log_files:
        p = Path(lf)
        if not p.exists():
            print(f"CANH BAO: khong thay log {lf}")
            continue
        for block in p.read_text(encoding="utf-8").split("→ ")[1:]:
            sid = block.split(" ", 1)[0]
            if "✅" in block:
                status[sid] = "✅ đã tạo"
            elif "❌" in block and not status.get(sid, "").startswith("✅"):
                status[sid] = "❌ lần chạy trước rơi"
    return status


def cell(s: str) -> str:
    return s.replace("|", "/").replace("\n", " ")


def bold_cue(text: str, cue: str) -> str:
    i = text.find(cue)
    if i < 0:
        return f"{text} (cue: **{cue}**)"
    return text[:i] + "**" + cue + "**" + text[i + len(cue):]


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("shots")
    ap.add_argument("--log", action="append", default=[], help="log cua run-shots.ts, lap lai duoc")
    ap.add_argument("--flow-status", help="JSON {checkedAt, result: {id: {found}}} tra THANG tren Flow — "
                    "thang log (Tu co the chay prompt tay tren Flow, log runner khong ghi)")
    args = ap.parse_args()

    shots_path = Path(args.shots)
    jobs_path = shots_path.with_name(shots_path.name.replace(".shots.json", ".jobs.json"))
    if not jobs_path.exists():
        sys.exit(f"khong thay {jobs_path} — chay build_image_prompts.py --shots truoc")
    data = json.loads(shots_path.read_text(encoding="utf-8"))
    jobs = {j["id"]: j for j in json.loads(jobs_path.read_text(encoding="utf-8"))}
    by_kind = json.loads(BY_KIND.read_text(encoding="utf-8")) if BY_KIND.exists() else {}
    status = read_status(args.log)
    if args.flow_status:
        fs_data = json.loads(Path(args.flow_status).read_text(encoding="utf-8"))
        # Flow tra theo TEN CARD. Shot da doi outName (vd bo net mat khong nguon, luong
        # img-skill-nhieu-anh-moi-cau D09) thi anh cu tren Flow mang ten cu — khong tinh la da tao.
        cur_names = {s["id"]: s["outName"] for seg in data["segments"] for s in seg["shots"]}
        for sid, r in fs_data.get("result", {}).items():
            if r.get("found") and r.get("name") and cur_names.get(sid) not in (None, r["name"]):
                status[sid] = "🔁 ảnh cũ trên Flow mang tên cũ — cần tạo lại"
            else:
                status[sid] = "✅ có trên Flow" if r.get("found") else "⏸ chưa có trên Flow"
        args.log.append(f"tra thẳng Flow lúc {fs_data.get('checkedAt', '?')} ({args.flow_status})")

    shots = [s for seg in data["segments"] for s in seg["shots"]]
    stale = [s["id"] for s in shots if s["id"] not in jobs]
    if stale:
        sys.exit(f".jobs.json cu hon .shots.json (thieu {stale}) — build lai truoc")

    asset_name = {a["id"]: a["flowAssetName"] for a in data.get("assets", [])}
    producer_of_name = {asset_name[s["produces"]]: s["id"] for s in shots if s.get("produces") in asset_name}
    users: dict[str, list[str]] = {}
    for s in shots:
        for a in s.get("useAsset", []):
            users.setdefault(a, []).append(s["id"])

    # `choTuLieu` = shot chua co anh tu lieu doi chieu (luong img-skill-nhieu-anh-moi-cau, D03):
    # prompt chi la ban nhap, KHONG chay truoc khi gom tu lieu.
    cho_tu_lieu = {s["id"]: s["choTuLieu"] for s in shots if s.get("choTuLieu")}

    def st(sid: str) -> str:
        base = status.get(sid, "⏸ chưa tạo")
        if sid in cho_tu_lieu and not base.startswith("✅"):
            base += " · ⏳ chờ tư liệu"
        return base

    title = data.get("video", {}).get("title", shots_path.stem)
    done = sum(1 for s in shots if st(s["id"]).startswith("✅"))
    L = [
        f"# Review prompt ảnh — {title}",
        "",
        f"Sinh bằng `scripts/review_shots.py` từ `{shots_path.name}` + `{jobs_path.name}`. "
        "Prompt dưới đây là **nguyên văn** gửi Flow. Cột *Lời kể* là trường `at`; chữ in đậm là `cue`.",
        "",
        f"**Trạng thái:** {done}/{len(shots)} ảnh đã tạo (theo log: {', '.join(args.log) or 'không truyền log'}).",
        "",
    ]
    if data.get("_anhChung"):
        L += ["**Mọi ảnh trong file này:** " + data["_anhChung"], ""]
    L += [
        "## Bảng tổng",
        "",
        "| Mã | Lời kể (`at`) | Loại | Tên card | Sinh bằng | Trạng thái |",
        "|---|---|---|---|---|---|",
    ]
    for s in shots:
        how = "chip @" if "mention" in s else "chữ + ảnh neo"
        if "produces" in s:
            how += " · **tạo asset**"
        L.append(f"| {s['id']} | {cell(bold_cue(s['at'], s['cue']))} | `{s['kind']}` | {cell(s['outName'])} | {how} | {st(s['id'])} |")

    if data.get("_raSoatSkill4d"):
        L += ["", "## Các quyết định theo skill 4d (rà 10 câu hỏi)", ""]
        L += [f"- **{k}** — {v}" for k, v in data["_raSoatSkill4d"].items()]
    if data.get("_thuNghiem"):
        L += ["", "**Thử nghiệm chưa đo:** " + data["_thuNghiem"]]

    L += ["", "## Từng shot"]
    for s in shots:
        j = jobs[s["id"]]
        L += ["", f"### {s['id']} · `{s['kind']}` · {st(s['id'])}", "",
              f"**Tên card:** {s['outName']}", "",
              f"**Lời kể (`at`):** {bold_cue(s['at'], s['cue'])}", "",
              f"**Ý đồ:** {s.get('intent', '')}", ""]
        # `anhSeRa` = mo ta tieng Viet anh prompt SE VE RA, Tu doc de duyet (2026-09-13).
        # `anhSeRaHash` = sha1 cua prompt luc viet mo ta. Prompt doi ma mo ta khong doi thi
        # hai ban lech nhau — dung loai loi D08 — nen bao to o day thay vi im lang.
        if s.get("anhSeRa"):
            L.append(f"**🖼️ Ảnh sẽ ra:** {s['anhSeRa']}")
            if s.get("anhSeRaHash") != prompt_hash(j["prompt"]):
                L.append("")
                L.append("> ⚠️ **Prompt đã đổi sau khi viết mô tả này** — mô tả có thể không còn đúng, viết lại `anhSeRa`.")
        else:
            L.append("**🖼️ Ảnh sẽ ra:** *(chưa có mô tả — thêm trường `anhSeRa` vào shot)*")
        L.append("")
        if s.get("canSoi"):
            L += [f"**🔍 Cần soi khi ra ảnh:** {s['canSoi']}", ""]
        if s.get("choTuLieu"):
            L += [f"**⏳ Chờ tư liệu — chưa chạy shot này:** {s['choTuLieu']}", ""]
        if j.get("promptParts"):
            chips = []
            for part in j["promptParts"]:
                if "asset" not in part:
                    continue
                name = os.path.basename(part["asset"])
                src = producer_of_name.get(name)
                kind = f"asset từ {src}" if src else ("file ảnh" if Path(part["asset"]).exists() else "asset có sẵn trên Flow")
                chips.append(f"`@{name}` ({kind})")
            L.append("**Sinh bằng:** câu @mention — chip " + ", ".join(chips) + ". Không đính thêm ảnh neo.")
        else:
            anchors = by_kind.get(s["kind"]) or by_kind.get("default") or []
            refs = [os.path.basename(r) for r in j.get("refNames", [])]
            extra = f"; đính thêm: {', '.join('`%s`' % r for r in refs)}" if refs else ""
            L.append("**Sinh bằng:** prompt chữ + ảnh neo theo `kind`: " + (", ".join(f"`{a}`" for a in anchors) or "(không)") + extra)
        if "produces" in s:
            L += ["", f"**Tạo asset** `{s['outName']}` — dùng lại ở: {', '.join(users.get(s['produces'], [])) or '(không shot nào)'}"]
        L += ["", "**Prompt gửi Flow:**", "", "```text", j["prompt"], "```"]
        if s.get("refs"):
            L += ["", "**Ảnh tư liệu đã soi (không gửi Flow):** " + ", ".join(f"`{r}`" for r in s["refs"])]
        if s.get("note"):
            L += ["", "**Ghi chú:** " + s["note"]]

    out = shots_path.with_name(shots_path.name.replace(".shots.json", ".review.md"))
    out.write_text("\n".join(L) + "\n", encoding="utf-8", newline="\n")
    # Chi in ASCII: console PowerShell la cp1252 (RUNBOOK muc 0).
    print(f"-> {out} | {done}/{len(shots)} da tao")
    return 0


if __name__ == "__main__":
    sys.exit(main())
