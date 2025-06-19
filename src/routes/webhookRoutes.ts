import { Router } from "express";
import { mercadoPagoWebhook } from "../controllers/webhookController";

const router = Router();

router.post("/webhooks/mercado-pago", mercadoPagoWebhook);

export default router; 