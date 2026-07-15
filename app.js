const list = document.getElementById('assetList');
const canvas = document.getElementById('canvas');
const browseBtn = document.getElementById('browseBtn');

browseBtn.onclick = async () => {
  const assets = await openAssetSelector();
  assets.map(normalizeAsset).forEach((a) => {
    const img = document.createElement('img');
    img.src = a.thumbnail;
    img.alt = a.name;
    img.title = a.name;
    img.className = 'thumb';
    img.draggable = true;
    img.dataset.full = a.path;
    img.ondragstart = (e) => e.dataTransfer.setData('text/plain', a.path);
    list.appendChild(img);
  });
};

canvas.ondragover = (e) => e.preventDefault();

canvas.ondrop = (e) => {
  e.preventDefault();
  const src = e.dataTransfer.getData('text/plain');
  if (!src) return;

  const img = document.createElement('img');
  img.src = src;
  img.className = 'canvas-img';
  img.style.left = e.offsetX + 'px';
  img.style.top = e.offsetY + 'px';
  canvas.appendChild(img);

  let ox, oy, dragging = false;
  img.onmousedown = (ev) => { dragging = true; ox = ev.offsetX; oy = ev.offsetY; };
  document.addEventListener('mousemove', (ev) => {
    if (!dragging) return;
    const r = canvas.getBoundingClientRect();
    img.style.left = (ev.clientX - r.left - ox) + 'px';
    img.style.top = (ev.clientY - r.top - oy) + 'px';
  });
  document.addEventListener('mouseup', () => { dragging = false; });
};