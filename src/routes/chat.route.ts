import { Router } from "express"
import { validate } from "@/middlewares/validation.middleware"
import { verifyToken } from "@/middlewares/auth.middleware"

const router = Router()

export default router