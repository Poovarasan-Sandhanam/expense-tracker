import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/database.js";
import rateLimiter from "./middleware/rateLimiter.js"; 
import  transactionRoute from "./routes/transactionsRoute.js"


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware to parse JSON

app.use(rateLimiter);
app.use(express.json());

app.use("/api/transactions", transactionRoute);

// Start server after DB is ready
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
    });
});
