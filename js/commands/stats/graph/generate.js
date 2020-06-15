const { writeFileSync } = require('fs');
const { removeExistingImage } = require('../../../functions.js');
const vega = require('vega');
const sharp = require('sharp');
const graphtypes = require('./graphtypes/graphs.js');
const { lineGraphFrom } = require('./graphtypes/linegraph.js');



// Generate a random name for the file to be created
function generateHexString (length) {
    return [...Array(length)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}


// Convert SVG file to PNG file
async function convertSVGToPNG (imgName) {

    await sharp(`./assets/temp/svg/${imgName}.svg`)
    .flatten({background :{r: 255, g: 255, b: 255, alpha: 1}})
    .png()
    .toFile(`./assets/temp/png/${imgName}.png`)
    .then(() => {

        console.log(`PNG file generated : '${imgName}.png'`);

    }).catch(function(err) {

        console.log(err);

    });
}


// Render image from given graph
function graphToImage (statsObject) {

    return new Promise(async (resolve, reject) => {

        // Generate a new 10-char hex string
        const imgName = generateHexString(10);


        var view = new vega.View(vega.parse(lineGraphFrom(statsObject)), {renderer: 'none'});


        try {
            const svg = await view.toSVG();

            // Write SVG to file
            writeFileSync(`./assets/temp/svg/${imgName}.svg`, svg);


            // Remove PNG file with same name if it exists
            removeExistingImage(imgName + '.png');


            // Convert SVG file to PNG file
            await convertSVGToPNG(imgName);


            // Remove corresponding temporary SVG file
            removeExistingImage(imgName + '.svg');


            // Return the name of the generated PNG file
            resolve(`${imgName}.png`);

        } catch (err) {

            reject(err);

        }
    });
}




module.exports = {

    // Generate image from given stats and returns the image's name
    generateImg: graphToImage,
};