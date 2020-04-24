const vega = require('vega');
const { writeFile, unlink } = require('fs');



// Delete graph file if it already exists
function removeExistingFile (name) {
    
    unlink(`../../../../generated/${name}.png`, (err) => {
        if(err && err.code == 'ENOENT') {
            console.info("File doesn't exist.");
        } else if (err) {
            console.error("Error occurred while trying to remove file");
        } else {
            console.info(`removed`);
        }
    });
}


// Generate a random name for the file to be created
function generateFileName (len) {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, len);
}


// Render image from given graph
async function graphToImage (statsObject) {

    graphObject = new vega.View(vega.parse(statsObject), { renderer: 'canvas'});

    const pngName = generateFileName(10);

    removeExistingFile(pngName);
    
    graphObject.toCanvas().then(canvas => {

        console.log('Writing PNG to file...');
        writeFile(`../../../../generated/${pngName}.png`, canvas.toBuffer());

    }).catch(err => {

        console.log("Error writing PNG to file:");
        console.error(err);

    });

    
    return pngName;
}




module.exports = {

    // Generate image from given stats and returns the image's name
    generateImg: async (statsObject) => {
        return (await graphToImage(statsObject));
    }
};