const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/requireAuth");
const { addFitnessData, getAllFitnessData, getFitnessData, deleteFitnessData, updateFitnessData } = require("../controllers/fitnessController")

// To Access the Protected route you go thorough requireAuth
router.use(requireAuth);

// 2.1 Add Fitness Data
router.post("/", addFitnessData);

// 2.2 Get All Fitness Data
router.get("/", getAllFitnessData);

// 2.3 Get a Fitness Data by ID
router.get("/:id", getFitnessData);

// 2.4 Delete Fitness Data by ID
router.delete("/:id", deleteFitnessData);

// 2.5 Update Fitness Data by ID
router.put("/:id", updateFitnessData);

module.exports = router;