const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema(
  {
    commonName: {
      type: String,
      required: true,
      trim: true,
    },
    scientificName: {
      type: String,
      required: true,
      trim: true,
    },
    ayushSystem: {
      type: String,
      required: true,
      enum: ["Ayurveda", "Unani", "Siddha", "Homeopathy", "Yoga"],
    },
    family: {
      type: String,
    },
    uses: {
      type: [String],
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    audioUrl: {
      type: String,
    },
    model3DUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Plant", plantSchema);
