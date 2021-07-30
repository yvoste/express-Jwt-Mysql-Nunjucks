/*
This middleware is used to create folder and to upload file (image) 
Doc Multer https://www.npmjs.com/package/multer
*/
const multer = require("multer")
const path = require('path')
const fs = require('fs')
// check if the file is an image
const imageFilter = (req, file, callBack) => {
  if (file.mimetype.startsWith("image")) {  // startsWith javascript function: check that mimetype start by 'image'
    callBack(null, true);
  } else {
    callBack("Please upload only images.", false);
  }
}

var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
     // it's used to create folder if not exist with the nickname of the user
    const dir = './public/img/' + req.user.nickname   
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true
      });
    }
    console.log('storage' + dir)
    callBack(null, dir)     // './public/img/user.name' directory name where save the file
  },
  // it's used to create specific filename of the image who is used in url_image in Database
  filename: (req, file, callBack) => {
    const newname = file.originalname.split('.')
    callBack(null, newname[0] + '-' + req.user.id_user + '-' + Date.now() + path.extname(file.originalname))
  }
})
// Do upload
var uploadFile = multer({ storage: storage, fileFilter: imageFilter })

module.exports = uploadFile;
