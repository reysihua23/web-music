(function () {
  "use strict";
  document.documentElement.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hover = window.matchMedia("(hover: hover)").matches;

  /* resaltado de sintaxis */
  var re = /(\/\/.*$)|("[^"]*"?)|\b(const|let|new|if|else|return|true|false|function|async|await|for|of|export|default)\b|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*)(?=\()|(\b[A-Za-z_]\w*)(?=:)|(\b[A-Za-z_]\w*)(?=\.)/g;
  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function hl(s) {
    var out = "", last = 0, m, c;
    re.lastIndex = 0;
    while ((m = re.exec(s))) {
      out += esc(s.slice(last, m.index));
      c = m[1] ? "c" : m[2] ? "s" : m[3] ? "k" : m[4] ? "n" : m[5] ? "f" : m[6] ? "t" : "v";
      out += '<span class="' + c + '">' + esc(m[0]) + "</span>";
      last = re.lastIndex;
    }
    return out + esc(s.slice(last));
  }

  /* título letra por letra */
  var h1 = document.getElementById("title"), i = 0;
  h1.dataset.text.split(" ").forEach(function (word) {
    var w = document.createElement("span");
    w.className = "w";
    w.setAttribute("aria-hidden", "true");
    word.split("").forEach(function (ch) {
      var l = document.createElement("span");
      l.className = "l";
      l.textContent = ch;
      l.style.setProperty("--i", i++);
      w.appendChild(l);
    });
    h1.appendChild(w);
  });

  /* pared de código */
  var pool = [
    'const rey = new ReyApp("Android");',
    'rey.buscar("rock"); // busca música y videos',
    'const resultados = await rey.buscar("pop");',
    'if (resultados.length > 0) {',
    '    rey.descargar(resultados[0]);',
    '}',
    'for (const cancion of lista) {',
    '    rey.reproducir(cancion); // sin salir de la app',
    '}',
    'function reinar(usuario) { return true; }',
    'const pantalla = rey.abrir(); // en segundos',
    'rey.verificar("sha256"); // integridad',
    'let volumen = 100;',
    'rey.video.play(archivo);',
    'export default rey; // Rey App'
  ];
  var wall = document.getElementById("wall"), html = "", k;
  for (k = 0; k < 44; k++) html += '<div class="ln">' + hl(pool[(k * 7 + (k % 3)) % pool.length]) + "</div>";
  wall.innerHTML = html + html;

  /* editor que se escribe solo */
  var lines = [
    '// Rey App · v1.0.0',
    'const app = {',
    '  nombre: "Rey App",',
    '  buscar: "música y videos",',
    '  descargar: true,',
    '  reproducir: true',
    '};',
    'app.buscar("tu canción favorita");',
    'app.descargar(); // listo en segundos',
    'app.reproducir();'
  ];
  var box = document.getElementById("typed"), li = 0, ci = 0, cur = '<i class="cur"></i>';
  function render() {
    var out = "", j;
    for (j = 0; j < li; j++) out += "<div>" + hl(lines[j]) + "</div>";
    out += "<div>" + (li < lines.length ? hl(lines[li].slice(0, ci)) : "") + cur + "</div>";
    box.innerHTML = out;
  }
  function tick() {
    if (li >= lines.length) return;
    ci++;
    if (ci > lines[li].length) { li++; ci = 0; render(); setTimeout(tick, 260); return; }
    render();
    setTimeout(tick, 26);
  }
  if (reduce) { li = lines.length; render(); } else { setTimeout(tick, 900); }

  /* inclinación del editor + luz que sigue al mouse */
  var ed = document.getElementById("editor");
  if (!reduce && hover) {
    document.addEventListener("pointermove", function (e) {
      var x = e.clientX / window.innerWidth, y = e.clientY / window.innerHeight;
      ed.style.setProperty("--ry", ((x - 0.5) * 12).toFixed(1) + "deg");
      ed.style.setProperty("--rx", ((0.5 - y) * 10).toFixed(1) + "deg");
      document.body.style.setProperty("--mx", e.clientX + "px");
      document.body.style.setProperty("--my", e.clientY + "px");
    });
  }

  /* palabras que rotan */
  var words = ["reinar en tu bolsillo", "ir más rápido", "tenerlo todo a mano", "disfrutar sin límites"];
  var rot = document.getElementById("rotator"), n = 0;
  setInterval(function () {
    rot.classList.add("out");
    setTimeout(function () {
      n = (n + 1) % words.length;
      rot.textContent = words[n];
      rot.classList.remove("out");
    }, 350);
  }, 2800);

  /* aparición al hacer scroll */
  var els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });

    /* botón flotante cuando el hero sale de pantalla */
    var fab = document.getElementById("fab");
    new IntersectionObserver(function (en) {
      fab.classList.toggle("show", !en[0].isIntersecting);
    }).observe(document.getElementById("hero"));
  } else {
    els.forEach(function (el) { el.classList.add("in"); });
  }

  /* imagen faltante → recuadro de ayuda */
  document.querySelectorAll("img[data-fallback]").forEach(function (img) {
    img.addEventListener("error", function () {
      var ph = document.createElement("div");
      ph.className = "ph";
      ph.textContent = "Sube " + img.dataset.fallback + " en /images";
      img.replaceWith(ph);
    });
  });

  /* capturas en grande */
  var lb = document.getElementById("lb"), lbimg = document.getElementById("lbimg");
  document.querySelectorAll(".shots figure").forEach(function (f) {
    f.addEventListener("click", function () {
      var img = f.querySelector("img");
      if (!img) return;
      lbimg.src = img.src; lbimg.alt = img.alt; lb.hidden = false;
    });
  });
  lb.addEventListener("click", function () { lb.hidden = true; });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") lb.hidden = true; });

  /* copiar SHA-256 */
  var copy = document.getElementById("copy");
  copy.addEventListener("click", function () {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(document.getElementById("hash").textContent).then(function () {
        copy.textContent = "Copiado";
        setTimeout(function () { copy.textContent = "Copiar"; }, 1800);
      });
    }
  });

  document.getElementById("yr").textContent = new Date().getFullYear();
})();
