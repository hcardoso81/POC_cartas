import cors from "cors";
import express from "express";
import { deckRoutes } from "./infrastructure/http/deckRoutes.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());
app.use(deckRoutes);

app.get("/health", (_request, response) => {
  response.json({ ok: true });
});

app.listen(port, () => {
  console.log(`POC Cartas API listening on http://localhost:${port}`);
});
