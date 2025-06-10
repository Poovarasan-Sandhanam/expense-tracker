import { sql } from "../config/database.js";

export async function getTranscationsByUserId(req,res) {
    try {
        const { userId } = req.params;

        const transactions = await sql`
    SELECT * FROM transactions
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    `;
        res.status(200).json(transactions);
    } catch (error) {
        console.log("Error getting the transactions", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function createTranscation(req, res) {
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
};

export async function deleteTranscation(req, res) {
    try {
        const { id } = req.params;

        if (isNaN(parseInt(id))) {
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
};

export async function getSummaryByUserId(req, res) {
    try {
        const { userId } = req.params;

        const balanceResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS balance
            FROM transactions
            WHERE user_id = ${userId}
        `;

        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS income
            FROM transactions
            WHERE user_id = ${userId} AND amount > 0
        `;

        const expenseResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS expenses
            FROM transactions
            WHERE user_id = ${userId} AND amount < 0
        `;

        res.status(200).json({
            balance: Number(balanceResult[0].balance),
            income: Number(incomeResult[0].income),
            expenses: Number(expenseResult[0].expenses),
        });
    } catch (error) {
        console.error("Error getting the summary:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

