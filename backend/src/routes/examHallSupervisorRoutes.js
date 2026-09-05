const express =
  require("express");

const router =
  express.Router();

const {
  createExamHallSupervisor,
  getAllExamHallSupervisors,
  getExamHallSupervisorById,
  updateExamHallSupervisor,
  deleteExamHallSupervisor
} = require(
  "../controllers/examHallSupervisorController"
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
  createExamHallSupervisor
);


// =========================================================
// GET ALL
// =========================================================

router.get(
  "/",
  authMiddleware,
  getAllExamHallSupervisors
);


// =========================================================
// GET BY ID
// =========================================================

router.get(
  "/:id",
  authMiddleware,
  getExamHallSupervisorById
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
  updateExamHallSupervisor
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
  deleteExamHallSupervisor
);


module.exports = router;