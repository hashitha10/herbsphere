const Plant = require("../models/Plant");

/**
 * GET all plants
 */
exports.getAllPlants = async (req, res) => {
  try {
    const plants = await Plant.find();
    res.status(200).json(plants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET plant by ID
 */
exports.getPlantById = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);

    if (!plant) {
      return res.status(404).json({ message: "Plant not found" });
    }

    res.status(200).json(plant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET plants by AYUSH system
 */
exports.getPlantsBySystem = async (req, res) => {
  try {
    const system = req.params.system;
    const plants = await Plant.find({ ayushSystem: system });
    res.status(200).json(plants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * CREATE plant (POST)
 */
exports.createPlant = async (req, res) => {
  try {
    const plant = new Plant(req.body);
    const savedPlant = await plant.save();
    res.status(201).json(savedPlant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * UPDATE plant by ID (PUT)
 */
exports.updatePlant = async (req, res) => {
  try {
    const updatedPlant = await Plant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedPlant) {
      return res.status(404).json({ message: "Plant not found" });
    }

    res.status(200).json(updatedPlant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// DELETE plant by ID
exports.deletePlant = async (req, res) => {
  try {
    const deletedPlant = await Plant.findByIdAndDelete(req.params.id);

    if (!deletedPlant) {
      return res.status(404).json({ message: "Plant not found" });
    }

    res.status(200).json({ message: "Plant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

