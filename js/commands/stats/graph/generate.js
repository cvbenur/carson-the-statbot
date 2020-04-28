const { writeFileSync, unlink, writeFile } = require('fs');
const vega = require('vega');



// Delete graph file if it already exists
async function removeExistingFile (name) {

    switch (name.split('.')[1]) {
        case 'svg': name = `svg/${name}`;
        case 'png': name = `png/${name}`;
        default: console.log(`Invalid file extension : ${name}`);
    }
    
    unlink(`./assets/generated/${name}`, (err) => {
        if(err && err.code == 'ENOENT') {
            console.info("File doesn't exist, cannot remove it.");
        } else if (err) {
            console.error("Error occurred while trying to remove file");
        } else {
            console.info(`removed`);
        }
    });
}


// Generate a random name for the file to be created
function generateHexString (length) {
    return [...Array(length)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}


// Write SVG string to file
function writeSVGToFile (svgString, svgName) {

    writeFile(`./assets/generated/svg/${svgName}`, svgString, (err) => {

        if (err) {
            // Logging errors
            console.error(err);
        } else console.log(`SVG written to file : '${svgName}'`)
    });
}


// Render image from given graph
async function graphToImage (statsObject) {

    // Generate a new 10-char hex string
    const imgName = generateHexString(10);


    var view = new vega.View(vega.parse(statsObject), {renderer: 'none'});


    // generate a static PNG image
    view.toSVG().then(async function (svg) {

        // Working SVG string
        //console.log(svg);

        // Write SVG to file
        writeSVGToFile(svg, imgName + '.svg');


        // WRITE SVG FILE TO PNG FILE
        

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
    }
};