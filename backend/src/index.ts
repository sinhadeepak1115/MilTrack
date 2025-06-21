import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoute";
import baseRoutes from "./routes/baseRoute";
import assetRoutes from "./routes/assetRoute";
import logRoutes from "./routes/logRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/base", baseRoutes);
app.use("/api/asset", assetRoutes);
app.use("/api/logs", logRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
