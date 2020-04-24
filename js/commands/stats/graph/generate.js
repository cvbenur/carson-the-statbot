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


    const pngName = generateFileName(10);

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