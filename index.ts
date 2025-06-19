import "dotenv/config";
import express from "express";
import paymentRoutes from "./src/routes/paymentRoutes";
import webhookRoutes from "./src/routes/webhookRoutes";

const app = express();

app.use(express.json());

// Rotas
app.use("/", paymentRoutes);
app.use("/", webhookRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
}); 