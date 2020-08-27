import { unlink } from 'fs';
import vega = require('vega');
import sharp = require('sharp');


// Remove existing generated file
function removeExistingImage(name: string): void {
  let locName = '';

  // Check the file's extension
  switch (name.split('.')[1]) {
    case 'svg':
      locName = `svg/${name}`;
      break;

    case 'png':
      locName = `png/${name}`;
      break;

    default:
      return;
  }

  unlink(`./assets/temp/${locName}`, (err) => {
    if (err && err.code === 'ENOENT') { console.info(`File '${locName}' doesn't exist, cannot remove it.`); } else if (err) {
      console.error(
        `Error occurred while trying to remove file : '${locName}'`,
      );
    } else console.info(`Removed file : '${locName}'`);
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
      .toFile(pngName);

  }).catch(function(err) {
      console.error(err);
  });

  return pngName;
}


// Returns name of generated PNG image
export function generatePNGFromGraph(graphObject): string {
  return graphToImage(graphObject);
}