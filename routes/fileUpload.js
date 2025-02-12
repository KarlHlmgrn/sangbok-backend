const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.use(fileUpload({
    // Configure file uploads with maximum file size 10MB
    limits: { fileSize: 10 * 1024 * 1024 },
  
    createParentPath: true, // Create parent directories if they don't exist
    abortOnLimit: true, // Abort the upload if the file size exceeds the limit
    responseOnLimit: 'File size limit has been reached', // Response message when file size limit is reached
    debug: true, // Enable debug mode for file uploads
    safeFileNames: true, // Sanitize file names to prevent directory traversal attacks
    preserveExtension: true, // Preserve the original file extension
    uploadTimeout: 60000, // Set a timeout for file uploads (in milliseconds)
}));

// Saves the uploaded file
router.post('/', (req, res, next) => {
    // Checks if a file was submitted
    if (!req.files || !req.files.file) {
        return res.status(422).send('No files were uploaded');
    }

    const uploadedFile = req.files.file;

    let fileType = '';

    // Gets the file type to determine which directory it should be saved in
    if (uploadedFile.mimetype === 'application/pdf') {
        fileType = 'pdf';
    } else if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg') {
        fileType = 'img';
    } else {
        return res.status(422).send('Invalid file type');
    }

    // Saves the file where the file name is its md5 hash
    fs.writeFileSync(path.resolve(`./uploads/${fileType}/${uploadedFile.md5}.${uploadedFile.name.match(/\.([a-z]{3,4})/)[1]}`), uploadedFile.data);

    // Returns the path to the file with the root uploads omitted
    res.send(`${fileType}/${uploadedFile.md5}.${uploadedFile.name.match(/\.([a-z]{3,4})/)[1]}`);
});

module.exports = router;