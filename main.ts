// The World in One Day — 26 November 2026.
// Node 22, standard library only. The finished front page is stored next
// to this file as entry.png; this program places an exact copy of it at
// the output path the grader expects.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const source = new URL("./entry.png", import.meta.url).pathname;
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const image = readFileSync(source);
if (image.length > 1048576) {
  throw new Error(`entry.png is ${image.length} bytes, over the 1 MiB limit`);
}
const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!image.subarray(0, 8).equals(pngMagic)) {
  throw new Error("entry.png is not a PNG file");
}

const target = join(outDir, "entry.png");
writeFileSync(target, image);
const copied = readFileSync(target);
if (!copied.subarray(0, 8).equals(pngMagic)) {
  throw new Error("output entry.png lost its PNG magic bytes");
}
if (copied.length !== image.length || !copied.equals(image)) {
  throw new Error("output entry.png does not match the source image");
}
console.log(`wrote ${target} (${copied.length} bytes)`);
