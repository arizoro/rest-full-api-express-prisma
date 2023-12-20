import usersService from "../service/users-service.js"
import fs from 'fs-extra'
const port = 'http://localhost:3000/image/'

const register = async(req, res , next) => {
    try {
        console.log(req.file)
        const image_src =`${port}${req.file.filename}`
        const image = req.file.filename
        const request = req.body
        request.image = image
        const result = await usersService.register(request)
        res.status(200).json({
            data : result,
            image_src : image_src
        })
    } catch(e) {
        next(e)
    }
}

const loginUser = async(req, res, next) => {
    try {
        const result = await usersService.loginUser(req.body)
        res.status(200).json({
            data : result
        })
    } catch (e) {
        next(e)
    }
}

const getUser = async (req, res, next) => {
    try {
        const username = req.user.username
        const result = await usersService.getUser(username)
        
        res.status(200).json({
            data : result
        })
    } catch (e) {
        next(e)
    }
}

const updateUser = async(req, res , next) => {
    try {
        const username = req.user.username
        const image_src =`${port}${req.file.filename}`

        const image = req.file.filename
        const old_image = req.user.image
        
        const request = req.body
        request.username = username
        request.image = image
        
        const result = await usersService.updateUser(request)

        if(result.image){
            fs.unlink(`public/images/${old_image}`, function(err){
                if(err){
                console.log(err)
                }
                console.log('berhasil di hapus')
            })
        }
        
        res.status(200).json({
            data : result,
            old_image : old_image,
            image_src : image_src
        })
    } catch (e) {
        next(e)
    }
}

const logout = async(req, res, next) => {
    try {
        const username = req.user.username
        await usersService.logout(username)
        res.status(200).json({
            data : "OK"
        })
        
    } catch (e) {
        next(e)
    }
}

export default {
    register,
    loginUser,
    getUser,
    updateUser,
    logout
}

