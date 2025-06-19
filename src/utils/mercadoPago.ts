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

  // ENDPOINT fictício para simulação.
  const url = "https://api.mercadopago.com/v1/payments/mock";

  try {
    const response = await axios.post<MercadoPagoResponse>(url, data, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    // Em ambiente de desenvolvimento, apenas retorna dados simulados.
    return {
      id: `mp_mock_${Date.now()}`,
      status: "approved",
    };
  }
}

export type { MercadoPagoResponse }; 