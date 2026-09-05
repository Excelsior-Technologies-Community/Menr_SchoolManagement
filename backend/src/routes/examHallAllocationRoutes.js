const express =
  require("express");

const router =
  express.Router();

const {
  createExamHallAllocation,
  getAllExamHallAllocations,
  getExamHallAllocationById,
  updateExamHallAllocation,
  cancelExamHallAllocation
} = require(
  "../controllers/examHallAllocationController"
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
  createExamHallAllocation
);


// =========================================================
// GET ALL
// =========================================================

router.get(
  "/",
  authMiddleware,
  getAllExamHallAllocations
);


// =========================================================
// GET BY ID
// =========================================================

router.get(
  "/:id",
  authMiddleware,
  getExamHallAllocationById
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
  updateExamHallAllocation
);


// =========================================================
// CANCEL
// =========================================================

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles(
    "SUPER_ADMIN"
  ),
  cancelExamHallAllocation
);


module.exports = router;