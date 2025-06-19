import axios, { AxiosError } from "axios";
import { randomUUID } from "crypto";

type MercadoPagoRequest = {
  method: string;
  amount: number;
  payer: {
    email: string;
    first_name?: string;
    last_name?: string;
    identification?: {
      type?: string;
      number?: string;
    };
  };
  idempotencyKey?: string;
};

type MercadoPagoResponse = {
  id: string;
  status: string;
  point_of_interaction?: {
    transaction_data?: {
      qr_code?: string;
      ticket_url?: string;
    };
  };
};

// Simula uma chamada externa de criação de pagamento no Mercado Pago.
export async function createPaymentOnMercadoPago(
  data: MercadoPagoRequest,
): Promise<MercadoPagoResponse> {
  const { ACCESS_TOKEN } = process.env;

  const url = "https://api.mercadopago.com/v1/payments";

  // Garante chave idempotente única por criação, podendo ser fornecida externamente
  const idempotencyKey = data.idempotencyKey ?? randomUUID();

  try {
    // Transformação mínima para formato da API real
    const payload = {
      transaction_amount: data.amount,
      payment_method_id: data.method,
      payer: {
        email: data.payer.email,
        first_name: data.payer.first_name,
        last_name: data.payer.last_name,
        identification: data.payer.identification,
      },
    };

    // Log de debug
    if (process.env.NODE_ENV !== "production") {
      console.log("[MP] Enviando pagamento PIX", {
        payload,
        idempotencyKey,
      });
    }

    const response = await axios.post<MercadoPagoResponse>(url, payload, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": idempotencyKey,
      },
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    if (err.response) {
      console.error("[MP] Erro ao criar pagamento:", {
        status: err.response.status,
        data: err.response.data,
      });
    } else {
      console.error("[MP] Erro inesperado ao criar pagamento:", err.message);
    }
    throw error;
  }
}

// Consulta um pagamento existente a partir do ID externo.
export async function getPaymentDetails(
  paymentId: string,
): Promise<MercadoPagoResponse> {
  const { ACCESS_TOKEN } = process.env;

  const url = `https://api.mercadopago.com/v1/payments/${paymentId}`;

  try {
    const response = await axios.get<MercadoPagoResponse>(url, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao consultar pagamento no Mercado Pago:", error);
    throw error;
  }
}

export type { MercadoPagoResponse };