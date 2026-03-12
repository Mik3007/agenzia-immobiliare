import express from "express";
import { sendValuationRequest } from "../controllers/valuation.controller.js";

const router = express.Router();

router.post("/", sendValuationRequest);

export default router;