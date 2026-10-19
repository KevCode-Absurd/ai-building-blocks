// Runs first on every page of the saved example app (finish.mjs adds it). There is no server behind the tour, so:
// - reads go to the files saved by snapshot.mjs (with or without a query string),
// - anything that would make, change or send something is stopped, with a note saying why,
// - moving between screens loads the next saved page,
// - a small bar says what this is and links back to AI Blocks.
(function () {
  var BASE = "/example-app";
  function load(file) {
    try {
      var x = new XMLHttpRequest();
      x.open("GET", BASE + file, false);
      x.send();
      if (x.status === 200) return JSON.parse(x.responseText);
    } catch (e) { /* not saved */ }
    return {};
  }
  var Q = load("/_q/index.json");
  var A = load("/_a/index.json");
  // The same hash as snapshot.mjs: two 32-bit FNV-1a passes.
  function fnv(s, h) { for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return ("0000000" + h.toString(16)).slice(-8); }
  function actionKey(id, body) { return fnv(id + "|" + body, 0x811c9dc5) + fnv(body + "|" + id, 0x01000193); }

  // A screen opened with a query (/production?job=job_119) is saved as its own page in _q/. The host can't see
  // queries, so open that page, then put the real address back before the app starts.
  var here = location.pathname.replace(/\/$/, "") + location.search;
  if (location.search && /\.html$/.test(Q[here] || "") && location.pathname.indexOf(BASE + "/_q/") !== 0) {
    location.replace(Q[here] + "#tour-from=" + encodeURIComponent(here + location.hash));
    return;
  }
  var from = /#tour-from=([^&]+)/.exec(location.hash);
  if (from) history.replaceState(history.state, "", decodeURIComponent(from[1]));

  var NOTE ="This is a tour of a finished app. Nothing is made, changed or saved here.";
  function fix(raw) {
    if (typeof raw !== "string" || raw.charAt(0) !== "/" || raw.charAt(1) === "/") return raw;
    var p = raw.indexOf(BASE + "/") === 0 || raw === BASE ? raw : BASE + raw;
    var path = p.split("#")[0];
    if (Q[path]) return Q[path];
    try { var dec = decodeURIComponent(path); if (Q[dec]) return Q[dec]; } catch (e) { /* bad escape */ }
    return p;
  }
  window._tourFix = fix;

  // The note shows only when someone has just clicked or typed: screens also send things on their own.
  var actedAt = 0;
  ["pointerdown", "keydown"].forEach(function (t) { addEventListener(t, function () { actedAt = Date.now(); }, true); });
  var toastAt = 0;
  function toast() {
    var now = Date.now();
    if (now - actedAt > 3000 || now - toastAt < 1500) return;
    toastAt = now;
    var t = document.getElementById("tour-toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "tour-toast";
      t.setAttribute("role", "status");
      document.body.appendChild(t);
    }
    t.textContent = NOTE;
    t.className = "on";
    clearTimeout(t._h);
    t._h = setTimeout(function () { t.className = ""; }, 3500);
  }

  var realFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    var url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    var method = ((init && init.method) || (input && input.method) || "GET").toUpperCase();
    var headers = new Headers((init && init.headers) || (input && input.headers) || {});
    var u;
    try { u = new URL(url, location.href); } catch (e) { return realFetch(input, init); }
    if (u.origin !== location.origin) return method === "GET" ? realFetch(input, init) : (toast(), new Promise(function () {}));
    // Moving to another screen: no server answers, so the browser loads that screen's saved page instead.
    if (headers.has("RSC") || headers.has("Next-Router-Prefetch") || u.searchParams.has("_rsc")) {
      return Promise.reject(new TypeError("tour: load the page"));
    }
    var action = headers.get("Next-Action");
    var body = (init && init.body) || "";
    if (action && typeof body === "string" && A[actionKey(action, body)]) {
      var hit = A[actionKey(action, body)];
      return realFetch(BASE + "/_a/" + actionKey(action, body) + ".txt").then(function (r) { return r.text(); }).then(function (t) {
        var h = { "content-type": hit.ct || "text/x-component" };
        if (hit.rev) h["x-action-revalidated"] = hit.rev;
        return new Response(t, { status: 200, headers: h });
      });
    }
    if (method !== "GET" && method !== "HEAD") {
      toast();
      // A server action that never answers leaves the screen as it is, which is the honest result here.
      if (headers.has("Next-Action")) return new Promise(function () {});
      return Promise.resolve(new Response(JSON.stringify({ error: NOTE }), { status: 403, headers: { "content-type": "application/json" } }));
    }
    var to = fix(u.pathname + u.search);
    return realFetch(to, { method: method, credentials: "same-origin" }).then(function (r) {
      if (r.ok) return r;
      return new Response(JSON.stringify({ error: "This part isn't in the tour." }), { status: 404, headers: { "content-type": "application/json" } });
    });
  };

  window.EventSource = function () { return { close: function () {}, addEventListener: function () {}, removeEventListener: function () {} }; };

  document.addEventListener("submit", function (e) { e.preventDefault(); e.stopPropagation(); toast(); }, true);

  // Pictures and links added after the page loads may still point at the app's own server paths.
  var ATTRS = ["src", "href", "poster"];
  function patch(el) {
    if (!el || el.nodeType !== 1 || (el.closest && el.closest("#tour-bar"))) return; // the bar's links leave the app

    for (var i = 0; i < ATTRS.length; i++) {
      var v = el.getAttribute(ATTRS[i]);
      if (v && v.charAt(0) === "/") { var f = fix(v); if (f !== v) el.setAttribute(ATTRS[i], f); }
    }
    var ss = el.getAttribute("srcset");
    if (ss && ss.indexOf("/") === 0) {
      var out = ss.split(",").map(function (s) { var p = s.trim().split(/\s+/); p[0] = fix(p[0]); return p.join(" "); }).join(", ");
      if (out !== ss) el.setAttribute("srcset", out);
    }
  }
  new MutationObserver(function (list) {
    for (var i = 0; i < list.length; i++) {
      var m = list[i];
      if (m.type === "attributes") patch(m.target);
      else for (var j = 0; j < m.addedNodes.length; j++) {
        var n = m.addedNodes[j];
        if (n.nodeType !== 1) continue;
        patch(n);
        var all = n.querySelectorAll ? n.querySelectorAll("[src],[href],[poster],[srcset]") : [];
        for (var k = 0; k < all.length; k++) patch(all[k]);
      }
    }
  }).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ["src", "href", "poster", "srcset"] });

  function bar() {
    if (document.getElementById("tour-bar")) return;
    var b = document.createElement("div");
    b.id = "tour-bar";
    b.innerHTML = '<span><b>Example app.</b> Click anything. Nothing here runs or saves.</span>' +
      '<a href="/apps/starter-pack">Build your own</a><a href="/apps">Back to AI Blocks</a><button type="button" aria-label="Hide this bar">×</button>';
    b.querySelector("button").onclick = function () { b.remove(); };
    document.body.appendChild(b);
  }
  // Added once the page has started up, so it never gets in the way of the app's own first render.
  if (document.readyState === "complete") setTimeout(bar, 300); else window.addEventListener("load", function () { setTimeout(bar, 300); });
})();
