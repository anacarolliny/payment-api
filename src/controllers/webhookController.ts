import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { getPaymentDetails } from "../utils/mercadoPago";
import axios from "axios";

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
    if (axios.isAxiosError(error) && error.response) {
      console.error("[MP] Webhook erro:", {
        status: error.response.status,
        message: (error.response.data as any)?.message,
        cause: (error.response.data as any)?.cause,
      });

      // Se pagamento não existe, respondemos 404 específico
      if (error.response.status === 404) {
        return res.status(404).json({ message: "Pagamento não encontrado no Mercado Pago" });
      }
    } else {
      console.error("[MP] Webhook erro inesperado:", error);
    }

    return res.status(500).json({ message: "Erro interno ao processar webhook" });
  }
} 