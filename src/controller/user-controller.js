import usersService from "../service/users-service.js"

const register = async(req, res , next) => {
    try {
        const result = await usersService.register(req.body)
        res.status(200).json({
            data : result
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
        const request = req.body
        request.username = username

        const result = await usersService.updateUser(request)
        res.status(200).json({
            data : result
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

