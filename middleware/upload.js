const multer = require("multer")
const path = require('path')
const fs = require('fs')

const imageFilter = (req, file, callBack) => {
  if (file.mimetype.startsWith("image")) {
    callBack(null, true);
  } else {
    callBack("Please upload only images.", false);
  }
}

var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    const dir = './public/img/' + req.user.nickname    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true
      });
    }
    console.log('storage' + dir)
    callBack(null, dir)     // './public/img/user.name' directory name where save the file
  },
  filename: (req, file, callBack) => {
    const newname = file.originalname.split('.')
    callBack(null, newname[0] + '-' + req.user.id_user + '-' + Date.now() + path.extname(file.originalname))
  }
})

var uploadFile = multer({ storage: storage, fileFilter: imageFilter });
module.exports = uploadFile;
