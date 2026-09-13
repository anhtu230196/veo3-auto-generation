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
import json
import re
import sys
from pathlib import Path

# Khoi nay Tu chot, chep nguyen van. Doi mot chu o day la doi ca hai lo anh,
# nen dung sua no de "thu cho hay hon" ma khong bao Tu.
#
# 2026-09-11 — Tu bo cau cuoi ("Actually, you know what, whatever, just draw it
# however you want"). Ly do do duoc bang me thu 10 anh dau video A: cau do cho
# model quyen bo qua moi chi dan phia tren, va no dung quyen do that — A1-03
# (ice pick) ra ANH CHUP THAT mot cai dui tren ban go, lech han khoi 7 anh con
# lai; nen trang cung khong duoc ton trong (mot anh nen kem, mot anh nen go).
STYLE_BLOCK = (
    "Use a white background, and make it look like it was drawn in an old "
    "computer painting program with a mouse. It should be vaguely similar but "
    "also not really, kind of matching but also off in a confusing, awkward "
    "way, with that low-quality pixel-by-pixel feel that really emphasizes how "
    "ridiculously bad it is."
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


def full_prompt(subject: str, style: str | None = None) -> str:
    """Noi khoi style. Dam bao dung mot dau cham truoc khi noi.

    `style` None = dung STYLE_BLOCK cung trong code (duong cu, SHOT-LIST.md).
    File .shots.json thi truyen thang truong `styleBlock` cua no vao day.

    🔴 BUG THAT 2026-09-12 (D08): ham nay tung noi cung STYLE_BLOCK va KHONG doc
    truong `styleBlock` cua artifact. Hau qua: file .shots.json khai khoi style
    ngan ("with the same style with reference images") nhung prompt that gui di
    van mang nguyen khoi DAI cu — dung cai Tu bao lam anh khong dong nhat. Neu
    da chay sinh anh luc do, ta se nhan lai style cu roi ket luan nham la cach
    moi khong an thua.
    """
    s = subject.strip().rstrip(".")
    return f"{s}. {(style or STYLE_BLOCK).strip()}"


# --------------------------------------------------------------- .shots.json
# Duong moi theo SPEC-v2 muc 5-6: doc .shots.json -> kiem cue -> giai refNames
# -> xuat .jobs.json cho runner. Duong cu (SHOT-LIST.md -> .prompts.txt) giu
# nguyen, chua bo, vi 385 dong van dang nam o do.

TS_RE = re.compile(r"\[\d+:\d{2}\]")


def norm(s: str) -> str:
    """Bo moc [m:ss] va gop khoang trang — dung cho ca hai ve khi doi chieu cue."""
    return " ".join(TS_RE.sub(" ", s).split())


def build_jobs(path: Path):
    """-> (jobs, problems). Moi job du de runner goi createImageIngredient."""
    data = json.loads(path.read_text(encoding="utf-8"))
    assets = {a["id"]: a["flowAssetName"] for a in data.get("assets", [])}
    transcript = norm((ROOT / data["video"]["transcript"]).read_text(encoding="utf-8"))

    # D08: khoi style LAY TU ARTIFACT. Neu la dict (dang {source, version} cua
    # SPEC-v2) thi coi nhu "dung khoi trong code"; neu la chuoi thi dung chuoi do.
    sb = data.get("styleBlock")
    style = sb if isinstance(sb, str) else None

    # 2026-09-12, Tu chot: NHAN VAT LUC NAO CUNG PHAI DU TU DAU DEN CHAN. Cau do
    # chi dung cho shot CO NGUOI, khong the nhoi vao khoi style chung — noi "ca
    # nguoi tu dau den chan" trong prompt mot cai ice pick la moi model VE THEM
    # NGUOI vao (dung bai hoc "dung lap tu nguoi/nhan vat" cua styleDNA).
    style_by_kind: dict[str, str] = data.get("styleByKind", {})

    jobs, problems, seen_names = [], [], {}
    for seg in data["segments"]:
        # Thu muc anh tu lieu cua segment: lay truong `refs` neu co, khong thi mac dinh
        # image-prompts/refs/<segmentId>/ (SPEC-v2 muc 2). Kich ban cua kenh de anh o
        # narration-scripts/<tap>/refs/case-N/ — thieu buoc nay thi ten anh trong
        # {{...}} va refImages khong bao gio tim thay file (2026-09-13).
        seg_refs = ROOT / seg["refs"] if seg.get("refs") else ROOT / "image-prompts" / "refs" / seg["id"]
        for shot in seg["shots"]:
            sid = shot["id"]

            # 5b: cue phai la trich NGUYEN VAN, va chi khop dung mot cho.
            hits = transcript.count(norm(shot["cue"]))
            if hits == 0:
                problems.append(f"{sid}: cue khong co trong transcript: {shot['cue']!r}")
            elif hits > 1:
                problems.append(f"{sid}: cue khop {hits} cho, khong neo duoc: {shot['cue']!r}")

            # 5a-bis: ten anh dau ra KHONG duoc trung ten asset minh tham chieu.
            ref_names = [assets[a] for a in shot.get("useAsset", []) if a in assets]
            missing = [a for a in shot.get("useAsset", []) if a not in assets]
            if missing:
                problems.append(f"{sid}: useAsset tro toi asset khong khai bao: {missing}")
            # D12: KHONG con tu suy ten. Ban vá tu suy (bo 2026-09-12) de ra ba vu
            # trung ten ngay trong me dau tien, vi mo ta nhan vat lap lai nen nam
            # chu dau giong het nhau. Va khong the them ma shot vao ten de phan
            # biet: `createImageIngredient` go ten card VAO CHINH PROMPT
            # (imageAsset.ts:540), nen chuoi "A1-13" se bi model ve thanh chu.
            if not shot.get("mention") and not shot.get("draw"):
                problems.append(f"{sid}: thieu ca `draw` va `mention` — khong co gi de gui di")

            out_name = shot.get("outName")
            if not out_name:
                problems.append(f"{sid}: thieu outName — ten card phai do nguoi dat, khong tu suy duoc")
                out_name = f"<thieu outName: {sid}>"
            if out_name in ref_names:
                problems.append(
                    f"{sid}: outName trung ten asset dang dinh ({out_name!r}) — "
                    "nhanh chong trung se nuot ca shot ma van bao thanh cong")

            # Hai shot cung ten card thi shot sau bi `assetAlreadyExists` bo qua
            # IM LANG — cung mot cai bay, chi khac la trung voi shot khac thay vi
            # trung voi asset.
            if out_name in seen_names:
                problems.append(
                    f"{sid}: ten card {out_name!r} trung voi {seen_names[out_name]} — "
                    "shot sau se bi bo qua ma van bao thanh cong")
            seen_names[out_name] = sid

            # Shot tao asset thi outName PHAI bang flowAssetName cua asset do.
            if "produces" in shot:
                want = assets.get(shot["produces"])
                if want and out_name != want:
                    problems.append(
                        f"{sid}: shot co produces nhung outName ({out_name!r}) "
                        f"khac flowAssetName ({want!r})")

            # Khoi style cho shot nay: `style` rieng cua shot THAY luon khoi
            # chung (dung cho noi chon dac biet co anh that, xem duoi); khong co
            # thi lay khoi chung + phan phu theo `kind`.
            if shot.get("style"):
                shot_style = shot["style"]
            else:
                extra = style_by_kind.get(shot["kind"], "")
                shot_style = f"{(style or STYLE_BLOCK).strip()} {extra.strip()}".strip()

            # ĐƯỜNG @MENTION (cach Tu prompt, chot 2026-09-12): shot khai `mention`
            # thi cau do la NGUYEN VAN prompt, voi {{ten-anh}} la cho chen chip @.
            #
            #   "mention": "draw a {{09-half-moon-hotel-1927-cihp__claude.jpg}}
            #               with the same style as {{01-pyramid-place.png}}"
            #
            # Vi sao manh hon: cau tu noi anh nao giu vai HINH KHOI va anh nao giu
            # vai NET VE. Dinh 4 anh qua bang chon roi mong model tu doan vai thi
            # khong — do that ngay 2026-09-12, xem RUNBOOK muc 0.
            #
            # Ten trong {{...}} tra theo thu tu: file trong refs/<segmentId>/, roi
            # file trong input/style-ref/_anchors/. Khong thay ca hai thi coi la ten
            # asset da co san tren Flow va de nguyen (runner se tra trong dialog @).
            mention_parts = None
            if shot.get("mention"):
                mention_parts = []
                for i, chunk in enumerate(re.split(r"\{\{(.+?)\}\}", shot["mention"])):
                    if i % 2 == 0:
                        if chunk:
                            mention_parts.append({"text": chunk})
                        continue
                    name = chunk.strip()
                    for cand in (seg_refs / name,
                                 ROOT / "input" / "style-ref" / "_anchors" / name):
                        if cand.exists():
                            mention_parts.append({"asset": str(cand)})
                            break
                    else:
                        mention_parts.append({"asset": name})
                if not any("asset" in p for p in mention_parts):
                    problems.append(f"{sid}: mention khong co {{{{ten-anh}}}} nao — dung `draw` cho prompt chu thuan")

                # 🔴 PHAN THEO `kind` CUNG PHAI DI VAO CAU MENTION (2026-09-13).
                # Ban dau duong mention bo qua han styleByKind, vi cho rang "cau
                # mention la nguyen van nguoi viet". Dung khi cau chi nhac lai
                # nhan vat DA CO asset (asset mang san mat don gian). SAI khi cau
                # DUA THEM NGUOI MOI vao — canh sat ap giai A1-07a, ban tu A1-18b:
                # nhung nguoi do khong co asset nao mang luat mat don gian, nen
                # se ra mat ve chi ta thuc dung loi da thay o A1-06. Noi vao cuoi
                # cau la an toan: `typeMentionPrompt` doc lai prompt sau khi go nen
                # chu go sau chip cuoi ma rot vao o search se bi bat.
                extra = style_by_kind.get(shot["kind"], "").strip()
                if extra:
                    last = mention_parts[-1]
                    if "text" in last:
                        last["text"] = last["text"].rstrip().rstrip(".") + ". " + extra
                    else:
                        mention_parts.append({"text": ". " + extra})

            # 🔴 refImages = ANH TU LIEU THAT, DINH THAT LEN FLOW. Day la NGOAI
            # LE co chu dich cua luat "refs khong bao gio toi runner" (SPEC-v2
            # muc 6): `refs` van chi de nguoi viet soi bang mat, con `refImages`
            # la danh sach duoc Tu cho phep upload. Tu chot 2026-09-12, sau khi
            # A1-11 ra mot toa nha co vom hoan toan khac khach san Half Moon
            # that. CHI dung cho NOI CHON DAC BIET — cong trinh co that ma hinh
            # khoi sai la nhan ra ngay.
            ref_images = []
            for fname in shot.get("refImages", []):
                p = seg_refs / fname
                if not p.exists():
                    problems.append(f"{sid}: refImages tro toi file khong co: {p}")
                else:
                    ref_images.append(str(p))

            job = {
                "id": sid,
                "segment": seg["id"],
                "at": shot["at"],
                "kind": shot["kind"],
                "outName": out_name,
                # Shot khai `mention` thi CAU MENTION CHINH LA PROMPT — khong doi
                # `draw` nua. Bat khai ca hai la moi hai ban lech nhau: runner gui
                # promptParts, con `prompt` chi con de doc bang mat, va khong ai
                # biet ban nao moi la that. Truong `prompt` o day giu ban phang
                # cua cau mention cho nguoi doc va cho nhat ky.
                "prompt": (
                    "".join(
                        (part["text"] if "text" in part else "@" + Path(part["asset"]).name)
                        for part in mention_parts
                    )
                    if mention_parts
                    else full_prompt(shot["draw"], shot_style)
                ),
                # `refs` (file local de soi bang mat) CO Y KHONG di vao day — xem
                # SPEC-v2 muc 6. `refImages` thi CO, xem ghi chu ngay tren.
                "refNames": ref_names + ref_images,
            }
            # 🔴 THU TU DINH CO ANH HUONG THAT. Me 13:05 ngay 2026-09-12: A1-11
            # dinh [3 anh neo, anh chup that] ra dung hinh khoi khach san nhung
            # NET VE THANG THOM nhu ban ve kien truc — khoi style doi "nguech
            # ngoac" thua han. Gia thuyet: anh dinh SAU CUNG la tin hieu manh
            # nhat, va o day no la anh CHUP. Nen shot co anh that thi day anh neo
            # xuong cuoi.
            if ref_images:
                job["anchorsLast"] = True
            if mention_parts:
                job["promptParts"] = mention_parts
                # Shot mention TU MANG anh cua no trong cau — runner khong duoc dinh
                # thêm anh neo vao nua, vi moi anh khong duoc nhac ten trong cau la
                # mot anh khong ro vai.
                job["noAnchors"] = True
            jobs.append(job)
    return jobs, problems


def cmd_shots(path: Path, check_only: bool) -> int:
    jobs, problems = build_jobs(path)
    for p in problems:
        print(f"LOI: {p}")
    if problems:
        return 1
    print(f"{len(jobs)} shot doc duoc, cue khop het.")
    for j in jobs:
        ref = f" <- {j['refNames']}" if j["refNames"] else ""
        print(f"  {j['id']:<7} [{j['at']:>5}] {j['kind']:<10} {j['outName']}{ref}")
    if check_only:
        return 0
    out = path.with_name(path.name.replace(".shots.json", ".jobs.json"))
    out.write_text(json.dumps(jobs, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"-> {out.name}")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--shot-list", default=str(SHOT_LIST))
    ap.add_argument("--shots", help="doc <id>.shots.json va xuat <id>.jobs.json")
    ap.add_argument("--check", action="store_true", help="chi dem, khong ghi file")
    ap.add_argument("--stdout", action="store_true", help="in ra man hinh")
    args = ap.parse_args()

    if args.shots:
        p = Path(args.shots)
        if not p.exists():
            sys.exit(f"khong tim thay {p}")
        return cmd_shots(p, args.check)

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
