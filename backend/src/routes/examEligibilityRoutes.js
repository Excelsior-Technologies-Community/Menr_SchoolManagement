const express =
  require("express");

const router =
  express.Router();

const {
  createExamEligibility,
  getAllExamEligibility,
  getExamEligibilityById,
  updateExamEligibility,
  deleteExamEligibility
} = require(
  "../controllers/examEligibilityController"
);

const authMiddleware =
  require("../middlewares/authMiddleware");

const authorizeRoles =
  require("../middlewares/roleMiddleware");


// =========================================================
// CREATE
// =========================================================

router.post(
  "/",
  authMiddleware,
  authorizeRoles(
    "SUPER_ADMIN",
    "SCHOOL_ADMIN"
  ),
  createExamEligibility
);


// =========================================================
// GET ALL
// =========================================================

router.get(
  "/",
  authMiddleware,
  getAllExamEligibility
);


// =========================================================
// GET BY ID
// =========================================================

router.get(
  "/:id",
  authMiddleware,
  getExamEligibilityById
);


// =========================================================
// UPDATE
// =========================================================

router.put(
  "/:id",
  authMiddleware,
  authorizeRoles(
    "SUPER_ADMIN",
    "SCHOOL_ADMIN"
  ),
  updateExamEligibility
);


// =========================================================
// DELETE / DEACTIVATE
// =========================================================

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles(
    "SUPER_ADMIN"
  ),
  deleteExamEligibility
);


module.exports = router;