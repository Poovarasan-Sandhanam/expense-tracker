import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/database.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionRoute from "./routes/transactionsRoute.js";
import job from "./config/cron.js";


dotenv.config();

const app = express();

if (process.env.NODE_ENV === "production") job.start();
// Middleware to parse JSON

app.use(rateLimiter);
app.use(express.json());

const PORT = process.env.PORT || 5001;

app.get("/api/wallet", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use("/api/transactions", transactionRoute);

// Start server after DB is ready
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
    });
});
