import express from "express";
import {
  createReview,
  listApprovedReviews,
  listAllReviews,
  approveReview,
  rejectReview,
  deleteReview,
} from "../controllers/reviews.controller.js";

import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", createReview);

router.get("/", listApprovedReviews);

router.get("/admin", requireAuth, listAllReviews);

router.get("/admin/all", requireAuth, listAllReviews);

router.patch("/:id/approve", requireAuth, approveReview);

router.patch("/:id/reject", requireAuth, rejectReview);

router.delete("/:id", requireAuth, deleteReview);

export default router;