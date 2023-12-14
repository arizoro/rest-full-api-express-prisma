import express from "express"
import userController from "../controller/user-controller.js"
import { authMiddleware } from "../middleware/auth-middleware.js"
import contactController from "../controller/contact-controller.js"
import addressController from "../controller/address-controller.js"

const userRouter = new express.Router()
userRouter.use(authMiddleware)

// User Api
userRouter.get("/api/users/current", userController.getUser)
userRouter.patch("/api/users/current", userController.updateUser)
userRouter.delete("/api/users/logout", userController.logout)

// Contact Api
userRouter.post("/api/contacts", contactController.create)
userRouter.get("/api/contacts/:contactId", contactController.get)
userRouter.put("/api/contacts/:contactId", contactController.update)
userRouter.delete("/api/contacts/:contactId", contactController.remove)
userRouter.get("/api/contacts", contactController.search)

// Address Api
userRouter.post("/api/contacts/:contactId/address", addressController.create)
userRouter.get("/api/contacts/:contactId/address/:addressId", addressController.get)
userRouter.get("/api/contacts/:contactId/address", addressController.list)
userRouter.put("/api/contacts/:contactId/address/:addressId", addressController.update)
userRouter.delete("/api/contacts/:contactId/address/:addressId", addressController.remove)

export {
    userRouter
}