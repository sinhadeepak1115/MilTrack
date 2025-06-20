import express from "express";
import userRoutes from "./routes/userRoute";
import baseRoutes from "./routes/baseRoute";
import assetRoutes from "./routes/assetRoute";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/base", baseRoutes);
app.use("/api/asset", assetRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
