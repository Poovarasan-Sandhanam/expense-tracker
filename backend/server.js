import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/database.js";

dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

const PORT = process.env.PORT || 5001;

// Initialize DB
async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS transactions (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                title VARCHAR(255) NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                category VARCHAR(255) NOT NULL,
                created_at DATE NOT NULL DEFAULT CURRENT_DATE
            )
        `;
        console.log("Database initialized successfully");
    } catch (error) {
        console.error("Error initializing DB:", error);
        process.exit(1);
    }
}

// Test route
app.get("/api/transactions/:userId", async(req, res) => {
   try{
    const {userId}  = req.params;
    console.log(userId);    

    const transactions = await sql `
    SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`;

    res.status(200).json(transactions);
}
   catch(error){
    console.error("Error creating the transaction:", error);
    res.status(500).json({ message: "Internal server error" });
   }
});

// Create transaction
app.post("/api/transactions", async (req, res) => {
    try {
        const { title, amount, category, user_id } = req.body;

        if (!title || !category || !user_id || amount === undefined) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const result = await sql`
            INSERT INTO transactions (user_id, title, amount, category)
            VALUES (${user_id}, ${title}, ${amount}, ${category})
            RETURNING *
        `;

        res.status(201).json(result[0]);
    } catch (error) {
        console.error("Error creating the transaction:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.delete("/api/transactions/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if(isNaN(parseInt(id))){
            return res.status(400).json({ message: "Invalid Transaction ID" });
        }

        const result = await sql`
            DELETE FROM transactions 
            WHERE id = ${id} 
            RETURNING *
        `;

        if (result.length === 0) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({ message: "Transaction deleted successfully", deleted: result[0] });
    } catch (error) {
        console.error("Error deleting the transaction:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Start server after DB is ready
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
    });
});
