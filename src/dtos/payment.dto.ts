import { z } from "zod";

export const paymentRequestSchema = z.object({
  method: z.string({ required_error: "O método de pagamento é obrigatório" }).min(1),
  amount: z
    .number({ invalid_type_error: "O valor deve ser numérico" })
    .positive("O valor deve ser positivo"),
  payer: z.object({
    email: z.string().email("E-mail inválido"),
  }),
});

export type PaymentRequestDTO = z.infer<typeof paymentRequestSchema>; 