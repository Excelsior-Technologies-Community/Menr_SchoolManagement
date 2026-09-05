const express =
  require("express");

const router =
  express.Router();

const {
  createExamHall,
  getAllExamHalls,
  getExamHallById,
  updateExamHall,
  deleteExamHall
} = require(
  "../controllers/examHallController"
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
  createExamHall
);


// =========================================================
// GET ALL
// =========================================================

router.get(
  "/",
  authMiddleware,
  getAllExamHalls
);


// =========================================================
// GET BY ID
// =========================================================

router.get(
  "/:id",
  authMiddleware,
  getExamHallById
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
  updateExamHall
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
  deleteExamHall
);


module.exports = router;