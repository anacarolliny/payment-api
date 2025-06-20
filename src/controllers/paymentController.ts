import { Request, Response } from "express";
import { paymentRequestSchema } from "../dtos/payment.dto";
import { createPayment } from "../services/paymentService";

export async function postPayment(req: Request, res: Response) {
  const parseResult = paymentRequestSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ errors: parseResult.error.format() });
  }

  try {
    const payment = await createPayment(parseResult.data);
    return res.status(201).json(payment);
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === "ERRO_MERCADO_PAGO") {
      return res.status(502).json({ message: "Falha ao comunicar com o Mercado Pago" });
    }
    return res.status(500).json({ message: "Erro interno ao processar pagamento" });
  }
} 