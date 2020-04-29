const { writeFileSync } = require('fs');
const { removeExistingImage } = require('../../../utilities.js');
const vega = require('vega');
const sharp = require('sharp');



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
async function graphToImage (statsObject) {

    // Generate a new 10-char hex string
    const imgName = generateHexString(10);


    var view = new vega.View(vega.parse(statsObject), {renderer: 'none'});


    // generate a static PNG image
    view.toSVG().then(async (svg) => {


        // Write SVG to file
        writeFileSync(`./assets/generated/svg/${imgName}.svg`, svg);


        // Remove PNG file with same name if it exists
        await removeExistingFile(imgName + '.png');


        // Convert SVG file to PNG file
        await convertSVGToPNG(imgName);


        // Remove corresponding temporary SVG file
        await removeExistingFile(imgName + '.svg');
        

    }).catch(function(err) {

        console.error(err);

    });

    
    // Return the name of the generated PNG file
    return `${imgName}.png`;
}




module.exports = {

    // Generate image from given stats and returns the image's name
    generateImg: async (statsObject) => {
        return (await graphToImage(statsObject));
    },
};