// Genera los íconos PNG de la app (una mancuerna) sin dependencias externas.
// Uso: node tools/generar-iconos.mjs
import fs from "node:fs";
import zlib from "node:zlib";

const BG = [15, 17, 21];
const FG = [163, 230, 53]; // verde lima (mismo acento que la app)

// Figuras en coordenadas relativas (0..1). Todo dentro del 60 % central para íconos "maskable".
const RECTS = [
  [0.30, 0.47, 0.70, 0.53], // barra
  [0.24, 0.34, 0.30, 0.66], // disco izq. grande
  [0.19, 0.40, 0.24, 0.60], // disco izq. pequeño
  [0.70, 0.34, 0.76, 0.66], // disco der. grande
  [0.76, 0.40, 0.81, 0.60], // disco der. pequeño
];

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

function png(size) {
  const raw = Buffer.alloc(size * (size * 3 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0; // filtro "none"
    for (let x = 0; x < size; x++) {
      const fx = (x + 0.5) / size, fy = (y + 0.5) / size;
      const on = RECTS.some(([x0, y0, x1, y1]) => fx >= x0 && fx <= x1 && fy >= y0 && fy <= y1);
      const [r, g, b] = on ? FG : BG;
      const i = y * (size * 3 + 1) + 1 + x * 3;
      raw[i] = r; raw[i + 1] = g; raw[i + 2] = b;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2; // 8 bits, RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

fs.mkdirSync("icons", { recursive: true });
for (const s of [192, 512]) fs.writeFileSync(`icons/icon-${s}.png`, png(s));

const svgRects = RECTS.map(([x0, y0, x1, y1]) =>
  `<rect x="${x0 * 100}" y="${y0 * 100}" width="${((x1 - x0) * 100).toFixed(1)}" height="${((y1 - y0) * 100).toFixed(1)}" rx="1.5"/>`).join("");
fs.writeFileSync("icons/icon.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="#0f1115"/><g fill="#a3e635">${svgRects}</g></svg>\n`);
console.log("Íconos generados en icons/");
