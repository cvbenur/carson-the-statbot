import { unlink } from 'fs';


// Remove existing generated file
export function removeExistingImage(name: string): void {
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