// Flechas dinámicas entre nodos
const connDefs = [
  ["SpeciesResource", "TraitResource", "#7ab7ff"],
  ["TraitResource", "AbilityResource", "#7ab7ff"],
  ["AbilityResource", "EffectResource", "#7ab7ff"],
  ["SpeciesOverlay", "SpeciesFactory", "#ffb86c"],
  ["SpeciesFactory", "SpeciesResource", "#ffb86c"],
  ["Food/Plant", "SpeciesResource", "#91d7a3"]
];

// Encuentra el panel
const diagram = document.getElementById("diagram");
const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("width", "100%");
svg.setAttribute("height", "100%");
svg.setAttribute("viewBox", "0 0 " + diagram.offsetWidth + " " + diagram.offsetHeight);
diagram.appendChild(svg);

// Crea el marcador de flecha
const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
marker.setAttribute("id", "arrow-dyn");
marker.setAttribute("viewBox", "0 0 10 10");
marker.setAttribute("refX", "8");
marker.setAttribute("refY", "5");
marker.setAttribute("markerWidth", "6");
marker.setAttribute("markerHeight", "6");
marker.setAttribute("orient", "auto");
const pathArrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
pathArrow.setAttribute("d", "M 0 0 L 10 5 L 0 10 z");
pathArrow.setAttribute("fill", "currentColor");
marker.appendChild(pathArrow);
svg.appendChild(marker);

// 🔄 Conecta nodos por nombre (h4 text)
function getNodeByTitle(name) {
  const all = diagram.querySelectorAll(".node");
  return Array.from(all).find(n =>
    n.querySelector("h4")?.textContent?.trim() === name
  );
}

function connect(aName, bName, color) {
  const a = getNodeByTitle(aName);
  const b = getNodeByTitle(bName);
  if (!a || !b) return;

  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();
  const dRect = diagram.getBoundingClientRect();

  const ax = aRect.left + aRect.width / 2 - dRect.left;
  const ay = aRect.top + aRect.height / 2 - dRect.top;
  const bx = bRect.left + bRect.width / 2 - dRect.left;
  const by = bRect.top + bRect.height / 2 - dRect.top;

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", `M ${ax} ${ay} C ${ax + 50} ${ay}, ${bx - 50} ${by}, ${bx} ${by}`);
  path.setAttribute("stroke", color);
  path.setAttribute("stroke-width", "2");
  path.setAttribute("fill", "none");
  path.setAttribute("marker-end", "url(#arrow-dyn)");
  svg.appendChild(path);
}

// Renderiza conexiones
connDefs.forEach(([a, b, color]) => connect(a, b, color));

// Opcional: vuelve a calcular flechas si el usuario redimensiona
window.addEventListener("resize", () => {
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  svg.appendChild(marker);
  connDefs.forEach(([a, b, color]) => connect(a, b, color));
});
