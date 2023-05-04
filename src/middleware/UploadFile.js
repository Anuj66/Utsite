const ResponseFormatter = require('../utils/ResponseFormatter')
const multer = require('multer')
const path = require("path")
const {tmpUploadPath} = require("../config/siteConfig")
const mkdirp = require('mkdirp')

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      mkdirp.sync(tmpUploadPath)
      callback(null, tmpUploadPath);
    },
    filename: function (req, file, callback) {
      callback(null, Date.now()+path.extname(file.originalname));
    }
});

const uploadImage = multer({ 
  storage : storage,
  limits:{fileSize: this.fieldname == "photo" ? 1000000 : 2000000}, // 10000000 Bytes = 10 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only images are allowed!"));
    }
  },
});

const uploadPDF = multer({ 
  storage : storage,
  fileSize: 2000000, // 10000000 Bytes = 10 MB
  fileFilter: (req, file, cb) => {
    
    if (
      file.mimetype == "application/pdf" ||
      file.mimetype == "application/msword" ||
      file.mimetype == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .pdf, .doc and .docx format allowed!"));
    }
  },
});

const uploadVideo = multer({
  storage: storage,
  limits: {
  fileSize: 10000000 // 10000000 Bytes = 10 MB
  },
  fileFilter(req, file, cb) {
    // upload only mp4 and mkv format
    if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) { 
       return cb(new Error('Please upload a video'))
    }
    cb(undefined, true)
 }
})

const uploadAny = multer({
  storage: storage,
})

const validateFileUpload = (err, req, res, next) => {
  
  if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      res.status(400).json(ResponseFormatter.setResponse(false, 400, err.message, 'ERROR', err));
  } else {
      // An unknown error occurred when uploading.
      res.status(400).json(ResponseFormatter.setResponse(false, 400, err.message, 'ERROR', err));
  } 
}

module.exports = {
  storage,
  uploadPDF,
  uploadImage,
  uploadVideo,
  uploadAny,
  validateFileUpload
}