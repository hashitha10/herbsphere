import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/plants";

// Get all plants
export const getAllPlants = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

// Get plant by ID
export const getPlantById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/${id}`);
  return response.data;
};

// Get plants by AYUSH system
export const getPlantsBySystem = async (system) => {
  const response = await axios.get(`${API_BASE_URL}/system/${system}`);
  return response.data;
};

// Search plants (optional; backend supports /search)
export const searchPlants = async (query) => {
  const response = await axios.get(`${API_BASE_URL}/search`, {
    params: { q: query },
  });
  return response.data;
};

// Create new plant (Admin)
export const createPlant = async (plantData) => {
  const response = await axios.post(API_BASE_URL, plantData);
  return response.data;
};

// Update plant
export const updatePlant = async (id, updatedData) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, updatedData);
  return response.data;
};

// Delete plant
export const deletePlant = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`);
  return response.data;
};
