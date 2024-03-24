"use strict"
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const maxSize = 5000000
const uploadedPath = path.join(process.cwd(), 'public/travel_package')

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         if (!fs.existsSync(uploadedPath)) {
//             fs.mkdirSync(uploadedPath, {
//                 recursive: true
//             })
//             return cb(null, uploadedPath)
//         }
//         return cb(null, uploadedPath)
//     },
//     filename: function (req, file, cb) {
//         return cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
//     }
// })

const imageUploader = multer({
    fileFilter: function (req, file, callback) {
        let ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        return callback(null, true)
    },
    limits: {
        fileSize: maxSize
    },
    // storage: storage
})

module.exports = imageUploader