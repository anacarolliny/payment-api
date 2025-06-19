import { z } from "zod";

export const paymentRequestSchema = z.object({
  method: z.string({ required_error: "O método de pagamento é obrigatório" }).min(1),
  amount: z
    .number({ invalid_type_error: "O valor deve ser numérico" })
    .positive("O valor deve ser positivo"),
  payer: z.object({
    email: z.string().email("E-mail inválido"),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    identification: z
      .object({
        type: z.string().optional(),
        number: z.string().optional(),
      })
      .optional(),
  }),
  token: z.string().optional(),
  installments: z.number().optional(),
  payment_method_id: z.string().optional(),
  description: z.string().optional(),
  externalReference: z.string().optional(),
  card: z
    .object({
      card_number: z.string(),
      expiration_year: z.string(),
      expiration_month: z.string(),
      security_code: z.string(),
      cardholder: z.object({
        name: z.string(),
        identification: z.object({
          type: z.string(),
          number: z.string(),
        }),
      }),
    })
    .optional(),
});

export type PaymentRequestDTO = z.infer<typeof paymentRequestSchema>; 