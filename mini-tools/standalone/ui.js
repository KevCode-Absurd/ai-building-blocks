// The calculator in one plain HTML file: the download (works offline) and the embed both run this.
// It reads window.MiniTool, which the first script on the page sets up from tool.mjs and engine.mjs.
// Nothing is sent anywhere. Your numbers are kept only in this browser, so they're still there next time.
(function () {
  var M = window.MiniTool, T = M.tool, E = M.engine;
  var embed = document.body.getAttribute("data-embed") === "1";
  var KEY = "abb:tool:" + T.slug;
  var saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { saved = {}; }
  var preset = (saved.preset && T.presets.some(function (p) { return p.id === saved.preset; })) ? saved.preset : T.presets[0].id;
  var raw = saved.raw && saved.preset === preset ? saved.raw : null;
  var sym = T.fixedCurrency || saved.sym || "$";
  var root = document.getElementById("app");

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    for (var k in attrs || {}) {
      if (k === "text") n.textContent = attrs[k];
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  function examplesFor(p) { var d = E.defaults(T, p), r = {}; for (var k in d) r[k] = String(d[k]); return r; }
  if (!raw) raw = examplesFor(preset);
  function save() { try { localStorage.setItem(KEY, JSON.stringify({ preset: preset, raw: raw, sym: sym })); } catch (e) { /* private mode: still works for this visit */ } }

  var out = el("div", { "class": "out", "aria-live": "polite" });
  // On a narrow screen the answer sits below the fields, so a bar at the bottom shows it while you type.
  var peek = el("div", { "class": "peek", "aria-hidden": "true" });
  var answerSeen = true;
  var watch = window.IntersectionObserver ? new IntersectionObserver(function (es) { answerSeen = es[0].isIntersecting || es[0].boundingClientRect.top < 0; peek.hidden = answerSeen; }) : null;
  var form = el("div", { "class": "form" });

  function drawForm() {
    form.innerHTML = "";
    if (T.presets.length > 1) {
      var seg = el("div", { "class": "seg", role: "group", "aria-label": "Your business" });
      T.presets.forEach(function (p) {
        seg.appendChild(el("button", { type: "button", "aria-pressed": String(p.id === preset), "data-preset": p.id, text: p.label, onclick: function () { preset = p.id; raw = examplesFor(p.id); save(); drawForm(); draw(); } }));
      });
      form.appendChild(seg);
    }
    form.appendChild(el("p", { "class": "note", text: "Example numbers are filled in. They aren't from any real business. Type your own." }));
    if (!T.fixedCurrency) {
      form.appendChild(el("label", { "class": "cur" }, [
        el("span", { "class": "lbl", text: "Currency sign" }),
        el("input", { value: sym, maxlength: "4", "data-input": "currency", oninput: function (e) { sym = e.target.value || "$"; save(); draw(); } }),
      ]));
    }
    var sections = T.sections || [{ id: "numbers", label: "Your numbers" }];
    var visible = E.visibleInputs(T, preset);
    sections.forEach(function (s) {
      var list = visible.filter(function (i) { return (i.section || "numbers") === s.id; });
      if (!list.length) return;
      var box = s.closed ? el("details", { "class": "sec" }, [el("summary", { text: s.label })]) : el("fieldset", { "class": "sec" }, [el("legend", { text: s.label })]);
      list.forEach(function (i) {
        var unit = i.unit === "money" || i.unit === "smallmoney" ? sym : i.unit === "percent" ? "%" : i.unit === "x" ? "x" : "";
        var input = el("input", { id: "in-" + i.id, inputmode: "decimal", autocomplete: "off", value: raw[i.id] == null ? "" : raw[i.id], "data-input": i.id, oninput: function (e) { raw[i.id] = e.target.value; save(); draw(); } });
        var help = el("details", { "class": "where" }, [
          el("summary", { text: "Where to find this number" }),
          el("p", { text: i.where }),
          i.tools && i.tools.length ? el("p", { "class": "tools", text: "Held in: " + i.tools.join(", ") }) : null,
        ]);
        box.appendChild(el("div", { "class": "field" }, [
          el("label", { "for": "in-" + i.id, "class": "lbl", text: i.label }),
          el("div", { "class": "box" }, unit === sym ? [el("span", { "class": "unit pre", text: unit }), input] : [input, unit ? el("span", { "class": "unit", text: unit }) : null]),
          el("p", { "class": "help", text: i.help }),
          el("p", { "class": "err", id: "err-" + i.id }),
          help,
        ]));
      });
      form.appendChild(box);
    });
  }

  function draw() {
    var read = E.readInputs(T, raw, preset);
    T.inputs.forEach(function (i) {
      var e = document.getElementById("err-" + i.id), f = document.getElementById("in-" + i.id);
      if (e) e.textContent = read.errors[i.id] || "";
      if (f) f.setAttribute("aria-invalid", read.errors[i.id] ? "true" : "false");
    });
    out.innerHTML = "";
    if (Object.keys(read.errors).length) {
      out.appendChild(el("p", { "class": "answer", text: "Fix the numbers marked in red to see the answer." }));
      return;
    }
    var env = E.compute(T, read.values);
    var ans = el("div", { "class": "answer", "data-answer": "1" });
    var said = E.answerLines(T, env, preset, sym);
    said.forEach(function (t) { ans.appendChild(el("p", { text: t })); });
    out.appendChild(ans);
    peek.textContent = said[0] || "";
    if (watch) { watch.disconnect(); watch.observe(ans); }

    var cmp = E.compareRows(T, read.values, preset, sym);
    if (cmp) {
      var tb = el("table", { "class": "cmp" });
      tb.appendChild(el("tr", {}, [el("th", { text: cmp.label })].concat(cmp.heads.map(function (h) { return el("th", { text: h }); }))));
      cmp.rows.forEach(function (r) { tb.appendChild(el("tr", {}, [el("td", { text: r.label })].concat(r.cells.map(function (c) { return el("td", { text: c }); })))); });
      out.appendChild(tb);
    }

    var lines = E.workingLines(T, env, preset, sym);
    var groups = {};
    lines.forEach(function (l) { if (l.group && T.outputs.some(function (o) { return o.id === l.id && o.row; })) (groups[l.group] = groups[l.group] || []).push(l); });
    Object.keys(groups).forEach(function (g) {
      var rows = {}, cols = [];
      groups[g].forEach(function (l) { var o = T.outputs.filter(function (x) { return x.id === l.id; })[0]; (rows[o.row] = rows[o.row] || {})[o.col] = l.shown; if (cols.indexOf(o.col) < 0) cols.push(o.col); });
      var tb = el("table", { "class": "cmp" });
      tb.appendChild(el("tr", {}, [el("th", { text: g })].concat(cols.map(function (c) { return el("th", { text: c }); }))));
      Object.keys(rows).forEach(function (r) { tb.appendChild(el("tr", {}, [el("td", { text: r })].concat(cols.map(function (c) { return el("td", { text: rows[r][c] || "" }); })))); });
      out.appendChild(tb);
    });

    var ol = el("ol", { "class": "working" });
    lines.forEach(function (l) {
      if (groups[l.group] && groups[l.group].indexOf(l) >= 0) return;
      ol.appendChild(el("li", { "data-line": l.id }, [
        el("div", { "class": "row" }, [el("span", { text: l.label }), el("b", { text: l.shown, "data-value": l.id })]),
        l.sum ? el("code", { text: l.sum }) : null,
        l.means ? el("p", { text: l.means }) : null,
      ]));
    });
    out.appendChild(el("h2", { text: "The working, line by line" }));
    out.appendChild(ol);

    var next = E.nextSteps(T, env);
    if (next.length && !embed) {
      out.appendChild(el("h2", { text: "Next step" }));
      next.forEach(function (n) { out.appendChild(el("p", {}, [n.why + " ", el("a", { href: M.site + "/skills/" + n.slug, target: "_blank", rel: "noopener", text: n.title || "Open it in the library" })])); });
    }
  }

  var credit = el("p", { "class": "credit" }, [el("a", { href: M.site + "/tools/" + T.slug, target: "_blank", rel: "noopener", text: T.name }), " · a free mini tool from AI Building Blocks"]);
  var head = embed ? el("header", {}, [el("h1", { text: T.headline })]) : el("header", {}, [el("h1", { text: T.headline }), el("p", { "class": "sub", text: T.summary }), el("p", { "class": "small", text: "Works offline. Your numbers stay on this computer." })]);
  root.appendChild(head);
  root.appendChild(el("div", { "class": "cols" }, [form, out]));
  if (!embed && T.notes && T.notes.length) root.appendChild(el("div", { "class": "notes" }, [el("h2", { text: "What this assumes" }), el("ul", {}, T.notes.map(function (n) { return el("li", { text: n }); }))]));
  root.appendChild(credit);
  peek.hidden = true;
  document.body.appendChild(peek);
  drawForm();
  draw();
})();
