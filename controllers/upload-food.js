const multer = require(`multer`)
const path = require(`path`)
const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, `./image`)
    },
    filename: (request, file, cb) => {
        cb(null, `image-${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage,  
    fileFilter: (request, file, cb) => {
        const acceptedType = [`image/jpg`,`image/jpeg`,`image/png`]
        if (!acceptedType.includes(file.mimetype)){
            cb(null, false)
            return cb(`Invalid file type (${file.mimetype})`)
        }
        const fileSize = request.headers[`content-length`]
        const maxSize = (1*2048*2048)
        if(fileSize > maxSize){
            cb(null, false)
            return cb(`File size is too large`)
        }
        cb(null, true)
    }
})
module.exports = upload