import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./auth/routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.get("/", (_, res) => res.send("API is running"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
