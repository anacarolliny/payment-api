import axios from "axios";

type MercadoPagoRequest = {
  method: string;
  amount: number;
  payer: {
    email: string;
  };
};

type MercadoPagoResponse = {
  id: string;
  status: string;
};

// Simula uma chamada externa de criação de pagamento no Mercado Pago.
export async function createPaymentOnMercadoPago(
  data: MercadoPagoRequest,
): Promise<MercadoPagoResponse> {
  const { ACCESS_TOKEN } = process.env;

  const url = "https://api.mercadopago.com/v1/payments";

  try {
    // Transformação mínima para formato da API real
    const payload = {
      transaction_amount: data.amount,
      payment_method_id: data.method,
      payer: {
        email: data.payer.email,
      },
    };

    const response = await axios.post<MercadoPagoResponse>(url, payload, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar pagamento no Mercado Pago:", error);
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