import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api", require("./routes/userRoute"));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT);
