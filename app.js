(function () {
  const $ = (s) => document.querySelector(s);
  let libros = [], proximos = [], obrasF = [], filtro = "Todas", oFiltro = "Todas", idx = 0, timer = null;
  const ROM = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"];
  const rom = (n) => ROM[n] || String(n);
  const norm = (t) => (t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const ruta = (l, ext) => "libros/" + l.slug + "/" + l.slug + "." + ext;
  const portada = (l) => "libros/" + l.slug + "/portada.jpg";

  function sitio(s) {
    $("#lema").textContent = s.lema || "";
    $("#presentacion").textContent = s.presentacion || "";
    $("#f-nombre").textContent = s.fundador_nombre || "";
    $("#f-foto").src = s.fundador_foto || "";
    $("#f-bio").innerHTML = "";
    (s.fundador_bio || []).forEach((p) => { const e = document.createElement("p"); e.textContent = p; $("#f-bio").appendChild(e); });
    $("#i-correo").textContent = s.correo || ""; $("#i-correo").href = "mailto:" + (s.correo || "");
    $("#g-link").href = s.galeria_url || "https://galeriarenacimiento.com";
    $("#o-amazon").href = s.amazon_url || "https://www.amazon.com/author/ricardolondono";
  }

  function hero(i) {
    if (!libros.length) return;
    idx = (i + libros.length) % libros.length;
    const l = libros[idx], img = $("#h-img");
    img.style.opacity = 0;
    setTimeout(() => { img.src = portada(l); img.alt = "Portada de " + l.titulo; img.style.opacity = 1; }, 350);
    $("#h-cartela").innerHTML = "";
    $("#h-cartela").append(l.titulo); const sm = document.createElement("small"); sm.textContent = l.autor; $("#h-cartela").appendChild(sm);
    document.querySelectorAll("#h-puntos button").forEach((b, k) => b.classList.toggle("on", k === idx));
  }
  function iniciarHero() {
    $("#h-puntos").innerHTML = "";
    libros.forEach((l, k) => { const b = document.createElement("button"); b.setAttribute("aria-label", l.titulo); b.onclick = () => { hero(k); reiniciar(); }; $("#h-puntos").appendChild(b); });
    hero(0); reiniciar();
    $("#h-img").onclick = () => abrir(libros[idx]); $("#h-img").style.cursor = "pointer";
  }
  function reiniciar() { clearInterval(timer); timer = setInterval(() => hero(idx + 1), 5000); }

  function pintar() {
    const q = norm($("#q").value);
    const lista = libros.filter((l) => (filtro === "Todas" || l.categoria === filtro) && (!q || norm(l.titulo + " " + l.autor).includes(q)));
    const muro = $("#muro"); muro.innerHTML = "";
    lista.forEach((l) => {
      const b = document.createElement("button"); b.className = "obra";
      b.innerHTML = '<div class="marco"><img loading="lazy"></div><div class="placa"><h3></h3><p></p></div>';
      b.querySelector("img").src = portada(l); b.querySelector("img").alt = "Portada de " + l.titulo;
      b.querySelector("h3").textContent = l.titulo;
      b.querySelector("p").textContent = rom(l.numero) + " · " + l.autor;
      b.onclick = () => abrir(l);
      muro.appendChild(b);
    });
    const pl = proximos.filter((l) => (filtro === "Todas" || l.categoria === filtro) && (!q || norm(l.titulo + " " + l.autor).includes(q)));
    const caja = $("#prox"); caja.innerHTML = "";
    pl.forEach((l) => { const d = document.createElement("div"); d.className = "libro-p"; d.innerHTML = '<span class="cinta">Próximamente</span><h4></h4><p></p>'; d.querySelector("h4").textContent = l.titulo; d.querySelector("p").textContent = l.autor; caja.appendChild(d); });
    $("#prox-caja").hidden = !pl.length;
    muro.hidden = !lista.length; $("#vacio").hidden = lista.length > 0 || pl.length > 0;
  }
  function filtros() {
    const cats = ["Todas"].concat([...new Set(libros.concat(proximos).map((l) => l.categoria))].sort());
    $("#filtros").innerHTML = "";
    cats.forEach((c) => { const b = document.createElement("button"); b.textContent = c; b.className = c === filtro ? "on" : ""; b.onclick = () => { filtro = c; filtros(); pintar(); }; $("#filtros").appendChild(b); });
  }
  function estante() {
    const cats = ["Todas"].concat([...new Set(obrasF.map((l) => l.categoria))]);
    $("#o-filtros").innerHTML = "";
    cats.forEach((c) => { const b = document.createElement("button"); b.textContent = c; b.className = c === oFiltro ? "on" : ""; b.onclick = () => { oFiltro = c; estante(); }; $("#o-filtros").appendChild(b); });
    const e = $("#estante"); e.innerHTML = "";
    obrasF.filter((l) => oFiltro === "Todas" || l.categoria === oFiltro).forEach((l) => {
      const a = document.createElement("article"); a.className = "lib";
      a.innerHTML = '<div class="tapa"><img loading="lazy"></div><div class="info"><h3></h3><p class="st"></p><p class="d"></p><p class="pr"></p><p class="pg"></p><a class="btn oscuro" target="_blank" rel="noopener">Comprar impreso</a></div>';
      const im = a.querySelector("img"); im.src = l.portada; im.alt = "Portada de " + l.titulo; im.referrerPolicy = "no-referrer";
      a.querySelector("h3").textContent = l.titulo;
      a.querySelector(".st").textContent = l.subtitulo || ""; a.querySelector(".st").hidden = !l.subtitulo;
      a.querySelector(".d").textContent = l.descripcion || "";
      a.querySelector(".pr").textContent = l.precio ? l.precio + " COP" : "";
      a.querySelector(".pg").textContent = l.paginas ? l.paginas + " páginas · " + l.categoria : l.categoria;
      a.querySelector("a").href = l.ae;
      e.appendChild(a);
    });
  }
  function abrir(l) {
    $("#m-img").src = portada(l); $("#m-img").alt = "Portada de " + l.titulo;
    $("#m-num").textContent = "Biblioteca Real · N.º " + rom(l.numero);
    $("#m-tit").textContent = l.titulo; $("#m-aut").textContent = l.autor;
    $("#m-meta").textContent = [l.categoria, l.epoca, l.paginas ? l.paginas + " páginas" : ""].filter(Boolean).join(" · ");
    $("#m-desc").textContent = l.descripcion || "";
    $("#m-leer").href = ruta(l, "pdf"); $("#m-pdf").href = ruta(l, "pdf"); $("#m-epub").href = ruta(l, "epub");
    $("#m-epub").hidden = l.epub === false;
    $("#modal").hidden = false; $("#velo").hidden = false; document.body.style.overflow = "hidden";
    history.replaceState(null, "", "#libro-" + l.slug);
  }
  function cerrar() { $("#modal").hidden = true; $("#velo").hidden = true; document.body.style.overflow = ""; history.replaceState(null, "", "#salas"); }
  $("#cerrar").onclick = cerrar; $("#velo").onclick = cerrar;
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrar(); });
  $("#q").addEventListener("input", pintar);

  fetch("catalogo.json?t=" + Date.now()).then((r) => r.json()).then((d) => {
    sitio(d.sitio || {});
    libros = (d.libros || []).sort((a, b) => a.numero - b.numero);
    proximos = d.proximos || []; obrasF = d.obras_fundador || [];
    estante(); $("#obras").hidden = !obrasF.length;
    $("#f-obras").textContent = libros.length;
    filtros(); pintar(); iniciarHero();
    const m = location.hash.match(/^#libro-(.+)$/);
    if (m) { const l = libros.find((x) => x.slug === m[1]); if (l) abrir(l); }
  }).catch(() => { $("#vacio").textContent = "No se pudo cargar el catálogo."; $("#vacio").hidden = false; });
})();
