import { Router } from "express";
import { postPayment } from "../controllers/paymentController";

const router = Router();

router.post("/payments", postPayment);

export default router; 