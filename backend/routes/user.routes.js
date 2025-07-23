import { registerUser } from "../controllers/user.controllers.js";
import { Router } from "express";

const router = Router();

router.patch('/api/register').post(registerUser);

export default router;