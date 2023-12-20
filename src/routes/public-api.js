import express from "express"
import userController from "../controller/user-controller.js"
import { uploaded } from "../middleware/multer.js"

const publicRouter = new express.Router()
publicRouter.post("/api/users",uploaded.single('image'), userController.register)
publicRouter.post("/api/users/login", userController.loginUser)

export {
    publicRouter
}