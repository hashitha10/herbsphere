const express = require("express");
const router = express.Router();
const {
  getAllPlants,
  getPlantById,
  searchPlants,
  getPlantsBySystem,
  createPlant,
  updatePlant,
  deletePlant
} = require("../controllers/plantController");


router.get("/", getAllPlants);
router.get("/search", searchPlants);

// GET plant by ID
router.get("/:id", getPlantById);

// GET plants by AYUSH system
router.get("/system/:system", getPlantsBySystem);

// CREATE plant
router.post("/", createPlant);

// UPDATE plant
router.put("/:id", updatePlant);
// DELETE plant
router.delete("/:id", deletePlant);


module.exports = router;
