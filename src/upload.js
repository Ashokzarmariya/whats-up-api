const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "./uploadFolder"))
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()  + '-' + file.orignalname)
    }
});

const fileFilter = (cb)=>{
    if (mimeType === "image/jpeg" || mimeType === "image/png") cb(null, true);
    else cb(null, false);
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        size: 1024 * 1024 * 5,
        
    }
});

module.exports = upload;