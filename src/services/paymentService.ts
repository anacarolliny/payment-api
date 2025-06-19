import { prisma } from "../prisma/client";
import { PaymentRequestDTO } from "../dtos/payment.dto";
import { createPaymentOnMercadoPago, MercadoPagoResponse } from "../utils/mercadoPago";

export async function createPayment(
  data: PaymentRequestDTO,
): Promise<Pick<MercadoPagoResponse, "id" | "status">> {
  // 1. Simula integração externa
  const mpResponse = await createPaymentOnMercadoPago(data);

  // 2. Persiste no banco
  await prisma.payment.create({
    data: {
      method: data.method,
      amount: data.amount,
      status: mpResponse.status,
      externalId: mpResponse.id,
    },
  });

  // 3. Retorna dados simulados de ID e status do Mercado Pago
  return {
    id: mpResponse.id,
    status: mpResponse.status,
  };
} 