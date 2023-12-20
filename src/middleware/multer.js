import multer from 'multer'
import bcrypt from 'bcrypt'

const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null,'public/images')
    },
    filename : async(req,file,cb) => {
        const rand = await bcrypt.hash(file.originalname, 10)
        const fileName = file.originalname
        cb(null,`${rand}-${fileName}`)
    }
})

export const uploaded = multer({
    storage: storage,
    limits :{
        fileSize : 3 *1000 *1000
    }
})