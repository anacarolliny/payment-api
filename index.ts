import "dotenv/config";
import express from "express";
import paymentRoutes from "./src/routes/paymentRoutes";

const app = express();

app.use(express.json());

// Rotas
app.use("/", paymentRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
}); 