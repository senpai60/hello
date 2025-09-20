const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ensureFolderExists = (folder) => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        if(file.fieldname==='profilePic'){
            const folder = 'uploads/profilePics'
            ensureFolderExists(folder)
            cb(null,folder)
        }else if (file.fieldname==='coverPhoto') {
            const folder = 'uploads/coverPhotos'
            ensureFolderExists(folder)
            cb(null,folder)
        } else if (file.fieldname === 'image') {
            const folder = 'uploads/posts';
            ensureFolderExists(folder);
            cb(null, folder);
        }
    },
    filename:function(req,file,cb){
        const ext = path.extname(file.originalname)
        cb(null,file.fieldname+'-' + Date.now() + ext)
    }
});

// File filter (optional)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;
    if (allowedTypes.test(ext) && allowedTypes.test(mime)) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    // Increase the file size limit to 20MB (20 * 1024 * 1024 bytes)
    limits: { fileSize: 20 * 1024 * 1024 } 
});

module.exports = upload;
