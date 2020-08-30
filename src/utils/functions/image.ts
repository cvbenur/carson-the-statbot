import { unlink } from 'fs';
import vega = require('vega');
import sharp = require('sharp');
import * as path from 'path';


const genFolder = path.join(__dirname, '..', '..', '..', 'generated');


// Remove existing generated file
function removeExistingImage(name: string): void {
  
  unlink(path.join(genFolder, name), (err) => {
    if (err && err.code === 'ENOENT') { console.info(`File '${name}' doesn't exist, cannot remove it.`); } else if (err) {
      console.error(
        `Error occurred while trying to remove file : '${name}'`,
      );
    } else console.info(`Removed file : '${name}'`);
  });
}

// Generate a random hexa string of given length
function generateHexString(length: number): string {
  return [...Array(length)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");
}

// Render image from given graph
function graphToImage(graphObject): string {

  const pngName = `${generateHexString(10)}.png`;
  removeExistingImage(pngName);

  const view = new vega.View(vega.parse(graphObject), {renderer: 'none'});

  view.toSVG().then(async (svg) => {

    await sharp(Buffer.from(svg))
      .toFormat('png')
      .toFile(path.join(genFolder, pngName));

  }).catch(function(err) {
      console.error(err);
  });

  return pngName;
}


// Returns name of generated PNG image
export function generatePNGFromGraph(graphObject): string {
  return graphToImage(graphObject);
}