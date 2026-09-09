#!/usr/bin/env python3
"""Dung ban doc HTML cho mot luong review — hien thi nhu mot nhom chat.

Ba agent noi chuyen qua repo chu khong qua mot kenh thoi gian thuc, nhung noi
dung thi dung la mot cuoc trao doi: tac gia nop bai, hai nguoi review tra loi,
tac gia phan hoi. Trang nay xep cac file vong thanh mot dong tin nhan theo thu
tu thoi gian, va cho bam vao ma D** de lan theo mot diem qua nhieu luot.

    python scripts/thread_view.py <slug> -o out.html

Chi doc coordination/threads/<slug>/. Khong sua file nao trong repo.
"""
from __future__ import annotations

import argparse
import html
import json
import re
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Nhan hien thi va ma hai ky tu tren avatar. Claude va Codex cung chu dau nen
# khong dung mot ky tu.
AGENT = {
    "claude": ("Claude", "CL"),
    "codex": ("Codex", "CX"),
    "gemini": ("Gemini", "GE"),
}

# Trang thai diem -> (nhan ngan, lop css). Chuoi doi chieu chep dung nguyen van
# tu bang trang thai o AGENTS.md muc 8.
STATUS_MAP = [
    ("chốt: đã sửa", "đã sửa", "st-fixed"),
    ("chốt: giữ nguyên", "giữ nguyên", "st-kept"),
    ("đã sửa ở v", "đã sửa", "st-fixed"),
    ("tác giả phản bác", "phản bác", "st-rebut"),
    ("đẩy lên Tú", "đẩy lên Tú", "st-esc"),
    ("mở", "mở", "st-open"),
]


def classify(status: str) -> tuple[str, str]:
    for needle, label, cls in STATUS_MAP:
        if status.startswith(needle):
            return label, cls
    return status, "st-open"


def read_thread(slug: str):
    d = ROOT / "coordination" / "threads" / slug
    if not d.is_dir():
        sys.exit("khong co luong %r trong coordination/threads/" % slug)
    text = (d / "THREAD.md").read_text(encoding="utf-8")

    meta, body = {}, text
    if text.startswith("---"):
        _, front, body = text.split("---", 2)
        for line in front.splitlines():
            if ":" in line and not line.lstrip().startswith("-"):
                key, _, val = line.partition(":")
                meta[key.strip()] = val.strip()

    points = []
    for line in body.splitlines():
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) == 5 and re.fullmatch(r"D\d+", cells[0]):
            label, cls = classify(cells[4])
            points.append({"id": cells[0], "by": cells[1], "round": cells[2],
                           "text": cells[3], "label": label, "cls": cls})

    turns = []
    for f in sorted(d.glob("r*.md")):
        m = re.match(r"r(\d+)-(\d+)-(proposal|response|review)-(\w+)$", f.stem)
        if not m:
            continue
        rnd, _, kind, agent = m.groups()
        md = f.read_text(encoding="utf-8")
        label, initials = AGENT.get(agent, (agent.title(), agent[:2].upper()))
        turns.append({
            "file": f.name,
            "round": int(rnd),
            "agent": agent,
            "agent_label": label,
            "initials": initials,
            "role": "tác giả" if kind in ("proposal", "response") else "người review",
            "when": datetime.fromtimestamp(f.stat().st_mtime).strftime("%H:%M"),
            "chars": len(md),
            "md": md,
        })
    return meta, points, turns


CSS = """
:root{
  --bg:#fbfbfa; --bubble:#ffffff; --bubble-edge:#e6e6e2;
  --ink:#1b1c1a; --ink-soft:#4b4d49; --muted:#84867f;
  --rule:#e6e6e2; --panel:#f1f1ee;
  --claude:#b0492c; --codex:#2c6d55; --gemini:#3d5896;
  --st-fixed:#2c6d55; --st-kept:#84867f; --st-open:#a9641f;
  --st-esc:#b0492c; --st-rebut:#79549f;
}
@media (prefers-color-scheme:dark){
  :root:not([data-theme="light"]){
    --bg:#101214; --bubble:#191c1f; --bubble-edge:#262a2e;
    --ink:#e7e9e6; --ink-soft:#b2b6b2; --muted:#868b87;
    --rule:#262a2e; --panel:#1f2326;
    --claude:#e58a6d; --codex:#6cbb9d; --gemini:#8fa9e2;
    --st-fixed:#6cbb9d; --st-kept:#868b87; --st-open:#dba263;
    --st-esc:#e58a6d; --st-rebut:#b596d8;
  }
}
:root[data-theme="dark"]{
  --bg:#101214; --bubble:#191c1f; --bubble-edge:#262a2e;
  --ink:#e7e9e6; --ink-soft:#b2b6b2; --muted:#868b87;
  --rule:#262a2e; --panel:#1f2326;
  --claude:#e58a6d; --codex:#6cbb9d; --gemini:#8fa9e2;
  --st-fixed:#6cbb9d; --st-kept:#868b87; --st-open:#dba263;
  --st-esc:#e58a6d; --st-rebut:#b596d8;
}
*{box-sizing:border-box}
body{background:var(--bg);color:var(--ink);margin:0;font-size:15px;line-height:1.65;
  font-family:"Be Vietnam Pro",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
code,pre,.mono,.time,.pill{font-family:"IBM Plex Mono",ui-monospace,Consolas,monospace}

.top{position:sticky;top:0;z-index:5;background:var(--bg);border-bottom:1px solid var(--rule)}
.top-in{max-width:880px;margin:0 auto;padding:14px 20px 12px}
.room{display:flex;align-items:baseline;flex-wrap:wrap;gap:4px 12px}
h1{font-size:17px;font-weight:600;letter-spacing:-.01em;margin:0}
.state{font-size:11.5px;color:var(--muted);font-variant-numeric:tabular-nums}
.state b{color:var(--ink-soft);font-weight:600}
.bar{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.pill{font-size:11px;padding:3px 9px;border:1px solid var(--rule);background:transparent;
  color:var(--muted);cursor:pointer;border-radius:999px;line-height:1.6}
.pill[aria-pressed="true"]{border-color:currentColor;font-weight:600}
.pill.p-claude[aria-pressed="true"]{color:var(--claude)}
.pill.p-codex[aria-pressed="true"]{color:var(--codex)}
.pill.p-gemini[aria-pressed="true"]{color:var(--gemini)}
.pill:focus-visible{outline:2px solid var(--ink);outline-offset:2px}
.pill.d[aria-pressed="true"]{background:var(--panel);border-color:currentColor}
.pill.d .dot{display:inline-block;width:6px;height:6px;border-radius:50%;
  background:currentColor;margin-right:5px;vertical-align:1px}
.pill.st-fixed{color:var(--st-fixed)}.pill.st-kept{color:var(--st-kept)}
.pill.st-open{color:var(--st-open)}.pill.st-esc{color:var(--st-esc)}
.pill.st-rebut{color:var(--st-rebut)}
.bar-label{font-size:11px;color:var(--muted);align-self:center;margin-right:2px}

.stream{max-width:880px;margin:0 auto;padding:22px 20px 90px}
.msg{display:grid;grid-template-columns:38px minmax(0,1fr);gap:12px;margin-bottom:26px}
.msg[hidden]{display:none}
.av{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;
  font-size:12px;font-weight:700;letter-spacing:.02em;color:#fff;
  font-family:"IBM Plex Mono",monospace}
.a-claude .av{background:var(--claude)}
.a-codex .av{background:var(--codex)}
.a-gemini .av{background:var(--gemini)}
.head{display:flex;align-items:baseline;flex-wrap:wrap;gap:2px 9px;margin-bottom:5px}
.name{font-size:14px;font-weight:600}
.a-claude .name{color:var(--claude)}
.a-codex .name{color:var(--codex)}
.a-gemini .name{color:var(--gemini)}
.role{font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;font-weight:600;
  color:var(--muted);border:1px solid var(--rule);border-radius:3px;padding:1px 5px}
.time{font-size:11px;color:var(--muted);font-variant-numeric:tabular-nums}
.fold{font-size:11px;color:var(--muted);background:none;border:0;cursor:pointer;
  padding:0;text-decoration:underline;text-underline-offset:2px;font-family:inherit}
.fold:focus-visible{outline:2px solid var(--ink);outline-offset:2px}
.bubble{background:var(--bubble);border:1px solid var(--bubble-edge);border-radius:12px;
  padding:14px 17px;overflow:hidden}
.bubble.short{max-height:190px;position:relative}
.bubble.short::after{content:"";position:absolute;left:0;right:0;bottom:0;height:70px;
  background:linear-gradient(to bottom,transparent,var(--bubble))}

.body{max-width:70ch}
.body>:first-child{margin-top:0}
.body h1{font-size:16px;margin:0 0 10px;font-weight:600;letter-spacing:-.01em}
.body h2{font-size:14.5px;margin:20px 0 8px;font-weight:600;padding-top:12px;
  border-top:1px solid var(--rule)}
.body h3{font-size:13.5px;margin:16px 0 6px;font-weight:600}
.body p{margin:0 0 10px}
.body ul,.body ol{margin:0 0 10px;padding-left:19px}
.body li{margin-bottom:4px}
.body strong{font-weight:600}
.body a{color:inherit;text-underline-offset:2px}
.body code{font-size:12.5px;background:var(--panel);padding:1px 4px;border-radius:3px}
.body pre{background:var(--panel);padding:12px 14px;overflow-x:auto;font-size:12px;
  line-height:1.55;border-radius:6px}
.body pre code{background:none;padding:0}
.body blockquote{margin:0 0 10px;padding-left:13px;border-left:2px solid var(--rule);
  color:var(--ink-soft)}
.body table{border-collapse:collapse;font-size:12.5px;width:100%}
.body th,.body td{border:1px solid var(--rule);padding:6px 9px;text-align:left;
  vertical-align:top}
.body th{background:var(--panel);font-weight:600}
.tablewrap{overflow-x:auto;margin-bottom:10px}
.dref{font-weight:600;font-size:12.5px;cursor:pointer;border-bottom:1px dotted currentColor;
  font-family:"IBM Plex Mono",ui-monospace,Consolas,monospace}
.dref.lit{background:var(--st-open);color:var(--bg);border-bottom:0;padding:0 3px;
  border-radius:3px}
.note{max-width:880px;margin:0 auto;padding:0 20px;font-size:12px;color:var(--muted)}

.waiting{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--muted);
  background:var(--panel);border-radius:12px;padding:9px 15px}
.dots{display:inline-flex;gap:3px}
.dots i{width:5px;height:5px;border-radius:50%;background:currentColor;opacity:.35}
@media (prefers-reduced-motion:no-preference){
  .dots i{animation:blink 1.4s infinite}
  .dots i:nth-child(2){animation-delay:.2s}
  .dots i:nth-child(3){animation-delay:.4s}
  @keyframes blink{0%,60%,100%{opacity:.25}30%{opacity:1}}
}
.msg.pending .av{opacity:.55}

@media (prefers-reduced-motion:no-preference){html{scroll-behavior:smooth}}
@media (max-width:560px){
  .msg{grid-template-columns:30px minmax(0,1fr);gap:9px}
  .av{width:30px;height:30px;font-size:10.5px}
  .bubble{padding:12px 13px;border-radius:10px}
}
"""

JS = r"""
document.querySelectorAll('.body[data-md]').forEach(function (el) {
  var md = SRC[+el.dataset.md] || '';
  if (window.marked) { el.innerHTML = marked.parse(md); }
  else { var p = document.createElement('pre'); p.textContent = md; el.appendChild(p); }
  el.querySelectorAll('table').forEach(function (t) {
    var w = document.createElement('div');
    w.className = 'tablewrap';
    t.parentNode.insertBefore(w, t);
    w.appendChild(t);
  });
  var walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  var hits = [], n;
  while ((n = walk.nextNode())) { if (/\bD\d{2}\b/.test(n.nodeValue)) hits.push(n); }
  hits.forEach(function (node) {
    if (!node.parentNode || node.parentNode.closest('pre,code,a')) return;
    var frag = document.createDocumentFragment(), last = 0, re = /\bD\d{2}\b/g, m;
    while ((m = re.exec(node.nodeValue))) {
      frag.appendChild(document.createTextNode(node.nodeValue.slice(last, m.index)));
      var s = document.createElement('span');
      s.className = 'dref';
      s.dataset.pt = m[0];
      s.textContent = m[0];
      frag.appendChild(s);
      last = m.index + m[0].length;
    }
    frag.appendChild(document.createTextNode(node.nodeValue.slice(last)));
    node.parentNode.replaceChild(frag, node);
  });
});

document.querySelectorAll('.fold').forEach(function (b) {
  var bub = document.getElementById(b.dataset.for);
  b.addEventListener('click', function () {
    var folded = bub.classList.toggle('short');
    b.textContent = folded ? 'mở rộng' : 'thu gọn';
    if (folded) bub.parentNode.scrollIntoView({ block: 'nearest' });
  });
});

var msgs = Array.prototype.slice.call(document.querySelectorAll('.msg'));
var off = {};
document.querySelectorAll('.pill[data-ag]').forEach(function (c) {
  c.addEventListener('click', function () {
    var a = c.dataset.ag, on = c.getAttribute('aria-pressed') === 'true';
    c.setAttribute('aria-pressed', String(!on));
    off[a] = on;
    msgs.forEach(function (m) { m.hidden = !!off[m.dataset.agent]; });
  });
});

var active = null;
function pick(id) {
  document.querySelectorAll('.dref.lit').forEach(function (s) { s.classList.remove('lit'); });
  var same = active === id;
  document.querySelectorAll('.pill[data-pt]').forEach(function (b) {
    b.setAttribute('aria-pressed', String(b.dataset.pt === id && !same));
  });
  if (same) { active = null; return; }
  active = id;
  var marks = Array.prototype.slice
    .call(document.querySelectorAll('.dref[data-pt="' + id + '"]'))
    .filter(function (s) {
      var m = s.closest('.msg');
      if (m.hidden) return false;
      var bub = s.closest('.bubble');
      if (bub && bub.classList.contains('short')) {
        bub.classList.remove('short');
        var f = document.querySelector('.fold[data-for="' + bub.id + '"]');
        if (f) f.textContent = 'thu gọn';
      }
      return true;
    });
  marks.forEach(function (s) { s.classList.add('lit'); });
  if (marks[0]) marks[0].scrollIntoView({ block: 'center' });
}
document.querySelectorAll('.pill[data-pt]').forEach(function (b) {
  b.addEventListener('click', function () { pick(b.dataset.pt); });
});
document.addEventListener('click', function (ev) {
  var s = ev.target.closest ? ev.target.closest('.dref') : null;
  if (s) pick(s.dataset.pt);
});
"""

FOLD_OVER = 4000  # ky tu: tren muc nay thi cuon gon lai cho de luot


def render(slug: str, meta: dict, points: list, turns: list, refresh: int = 0) -> str:
    e = html.escape

    tally = {}
    for p in points:
        tally[p["label"]] = tally.get(p["label"], 0) + 1
    tally_txt = ", ".join("%d %s" % (v, k) for k, v in tally.items()) or "chưa có điểm"

    chips = "".join(
        '<button class="pill d %s" data-pt="%s" aria-pressed="false" title="%s">'
        '<span class="dot"></span>%s</button>'
        % (p["cls"], e(p["id"]), e(p["text"]), e(p["id"]))
        for p in points)

    msgs = []
    for i, t in enumerate(turns):
        bub = "b%d" % i
        folded = t["chars"] > FOLD_OVER
        fold_btn = ('<button class="fold" data-for="%s">%s</button>'
                    % (bub, "mở rộng" if folded else "thu gọn"))
        msgs.append(
            '<article class="msg a-%s" id="m%d" data-agent="%s">'
            '<div class="av" aria-hidden="true">%s</div>'
            '<div><div class="head"><span class="name">%s</span>'
            '<span class="role">%s · vòng %d</span>'
            '<span class="time">%s · %s ký tự</span>%s</div>'
            '<div class="bubble%s" id="%s"><div class="body" data-md="%d"></div></div>'
            '</div></article>'
            % (e(t["agent"]), i, e(t["agent"]), e(t["initials"]), e(t["agent_label"]),
               e(t["role"]), t["round"], e(t["when"]), format(t["chars"], ","),
               fold_btn, " short" if folded else "", bub, i))

    # Hang cuoi dong chat: luong con mo thi noi ro dang cho ai. Day la thu
    # nguoi doc can nhat khi mot luot chay 10 phut ma man hinh khong doi gi.
    if meta.get("status") == "open" and meta.get("turn"):
        ag = meta["turn"]
        label, initials = AGENT.get(ag, (ag.title(), ag[:2].upper()))
        role = {"author": "tác giả", "reviewer": "người review"}.get(
            meta.get("turn_role", ""), meta.get("turn_role", ""))
        msgs.append(
            '<article class="msg pending a-%s" data-agent="%s">'
            '<div class="av" aria-hidden="true">%s</div>'
            '<div><div class="head"><span class="name">%s</span>'
            '<span class="role">%s · vòng %s</span></div>'
            '<div class="waiting">đang tới lượt'
            '<span class="dots"><i></i><i></i><i></i></span></div>'
            '</div></article>'
            % (e(ag), e(ag), e(initials), e(label), e(role), e(meta.get("round", "?"))))

    payload = json.dumps([t["md"] for t in turns], ensure_ascii=False).replace("</", "<\\/")

    # Tu tai lai khi luong dang chay, de nguoi doc theo doi luot ke tiep.
    reload_tag = ('<meta http-equiv="refresh" content="%d">\n' % refresh) if refresh > 0 else ""

    # Khi publish thanh Artifact thi vo boc da co san charset, nhung file nay
    # con duoc mo thang tu o dia — thieu the nay thi tieng Viet vo thanh mojibake.
    return (
        '<meta charset="utf-8">\n%s'
        '<title>Luồng %s</title>\n'
        '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
        'family=Be+Vietnam+Pro:wght@400;500;600;700&'
        'family=IBM+Plex+Mono:wght@400;500;700&display=swap">\n'
        '<style>%s</style>\n'
        '<header class="top"><div class="top-in">\n'
        '<div class="room"><h1>%s</h1>'
        '<span class="state">bước %s · bản <b>v%s</b> · <b>%s</b> · %d điểm (%s)</span></div>\n'
        '<div class="bar">'
        '<button class="pill p-claude" data-ag="claude" aria-pressed="true">Claude</button>'
        '<button class="pill p-codex" data-ag="codex" aria-pressed="true">Codex</button>'
        '<button class="pill p-gemini" data-ag="gemini" aria-pressed="true">Gemini</button>'
        '</div>\n<div class="bar"><span class="bar-label">Điểm</span>%s</div>\n'
        '</div></header>\n'
        '<main class="stream">%s</main>\n'
        '<p class="note">Sản phẩm đang review: <code>%s</code>. '
        'Ba agent không nói chuyện thời gian thực — mỗi tin nhắn là một file vòng trong '
        '<code>coordination/threads/%s/</code>, orchestrator chuyển lượt.</p>\n'
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.2/marked.min.js">'
        '</script>\n<script>\nvar SRC = %s;\n%s</script>\n'
        % (reload_tag, e(slug), CSS, e(slug), e(meta.get("step", "?")),
           e(meta.get("artifact_version", "?")), e(meta.get("status", "?")),
           len(points), e(tally_txt), chips, "".join(msgs),
           e(meta.get("artifact", "—")), e(slug), payload, JS))


def default_out(slug: str) -> Path:
    """File sinh ra, khong commit — xem .gitignore."""
    return ROOT / "coordination" / "threads" / slug / "view.html"


def write_view(slug: str, out: str | Path | None = None, refresh: int = 0) -> Path:
    """Sinh trang doc cho mot luong. orchestrate.py goi thang ham nay moi luot."""
    meta, points, turns = read_thread(slug)
    path = Path(out) if out else default_out(slug)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(render(slug, meta, points, turns, refresh), encoding="utf-8")
    return path


def main() -> None:
    ap = argparse.ArgumentParser(description="Ban doc HTML cho mot luong review.")
    ap.add_argument("slug")
    ap.add_argument("-o", "--out", help="mac dinh: coordination/threads/<slug>/view.html")
    ap.add_argument("--refresh", type=int, default=0, metavar="GIAY",
                    help="tu tai lai trang sau moi N giay (0 = tat)")
    args = ap.parse_args()
    meta, points, turns = read_thread(args.slug)
    if not turns:
        sys.exit("luong %r chua co file vong nao de doc." % args.slug)
    path = write_view(args.slug, args.out, args.refresh)
    print("da ghi %s — %d luot, %d diem" % (path, len(turns), len(points)))


if __name__ == "__main__":
    main()
