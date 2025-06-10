import express from "express";
import {
    createTranscation,
    deleteTranscation,
    getSummaryByUserId,
    getTranscationsByUserId
} from "../controllers/transactionsController.js"

const router = express.Router();

router.get("/:userId", getTranscationsByUserId);
router.post("/", createTranscation);
router.delete("/:id", deleteTranscation);
router.get("/summary/:userId", getSummaryByUserId);

export default router;