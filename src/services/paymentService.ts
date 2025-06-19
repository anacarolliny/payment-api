import { prisma } from "../prisma/client";
import { PaymentRequestDTO } from "../dtos/payment.dto";
import { createPaymentOnMercadoPago, MercadoPagoResponse } from "../utils/mercadoPago";
import { randomUUID } from "crypto";
import axios from "axios";

type PixInfo = {
  qr_code: string | null;
  ticket_url: string | null;
};

export async function createPayment(
  data: PaymentRequestDTO,
): Promise<{ id: string; status: string; pix: PixInfo }> {
  // 1. Integração real com Mercado Pago
  let mpResponse: MercadoPagoResponse;
  try {
    const idemKey = randomUUID();
    mpResponse = await createPaymentOnMercadoPago({ ...data, idempotencyKey: idemKey });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("[MP] Falha ao criar pagamento:", {
        status: error.response.status,
        message: error.response.data?.message,
        cause: error.response.data?.cause,
      });
    } else {
      console.error("[MP] Erro inesperado:", error);
    }
    throw new Error("ERRO_MERCADO_PAGO");
  }

  // 2. Persiste no banco
  await prisma.payment.create({
    data: {
      method: data.method,
      amount: data.amount,
      status: mpResponse.status,
      externalId: String(mpResponse.id),
    },
  });

  // 3. Retorna dados ao cliente com informações de PIX
  return {
    id: mpResponse.id,
    status: mpResponse.status,
    pix: {
      qr_code: mpResponse.point_of_interaction?.transaction_data?.qr_code ?? null,
      ticket_url: mpResponse.point_of_interaction?.transaction_data?.ticket_url ?? null,
    },
  };
} 