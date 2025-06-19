import { prisma } from "../prisma/client";
import { PaymentRequestDTO } from "../dtos/payment.dto";
import { createPaymentOnMercadoPago, MercadoPagoResponse } from "../utils/mercadoPago";

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
    mpResponse = await createPaymentOnMercadoPago(data);
  } catch (error) {
    console.error("Falha ao criar pagamento no Mercado Pago:", error);
    throw new Error("ERRO_MERCADO_PAGO");
  }

  // 2. Persiste no banco
  await prisma.payment.create({
    data: {
      method: data.method,
      amount: data.amount,
      status: mpResponse.status,
      externalId: mpResponse.id,
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