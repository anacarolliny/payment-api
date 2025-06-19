import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { getPaymentDetails } from "../utils/mercadoPago";

interface MercadoPagoWebhookEvent {
  type: string;
  data: {
    id: string;
  };
}

export async function mercadoPagoWebhook(req: Request, res: Response) {
  const event = req.body as MercadoPagoWebhookEvent;

  // Ignora eventos que não sejam de pagamento
  if (event.type !== "payment") {
    return res.status(200).send();
  }

  const paymentId = event.data?.id;
  if (!paymentId) {
    return res.status(400).json({ message: "paymentId ausente no webhook" });
  }

  try {
    // Consulta detalhes do pagamento na API do Mercado Pago
    const mpPayment = await getPaymentDetails(paymentId);

    // Atualiza status no banco
    await prisma.payment.updateMany({
      where: { externalId: paymentId },
      data: { status: mpPayment.status },
    });

    return res.status(200).send();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Erro webhook MP:", error);
    return res.status(500).json({ message: "Erro ao processar webhook", error: errorMessage });
  }
} 