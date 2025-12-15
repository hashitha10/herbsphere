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

    // normalized API fields requested by client
    name: {
      type: String,
      trim: true,
    },
    system: {
      type: String,
      trim: true,
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
    image: {
      type: String,
    },
    audioUrl: {
      type: String,
    },
    audioPath: {
      type: String,
    },
    audioText: {
      type: String,
    },
    model3DUrl: {
      type: String,
    },
    modelPath: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Plant", plantSchema);
