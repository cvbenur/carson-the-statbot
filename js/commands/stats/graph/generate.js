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
function generateHexString (length) {
    return [...Array(length)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}


// Render image from given graph
async function graphToImage (statsObject) {


    // Generate a new 10-char hex string
    const pngName = generateHexString(10);

    removeExistingFile(pngName);


    // Convert stats object to graph
    
    // Generate image and save file to PNG in the "../../../../" directory

    
    return pngName;
}




module.exports = {

    // Generate image from given stats and returns the image's name
    generateImg: async (statsObject) => {
        return (await graphToImage(statsObject));
    }
};