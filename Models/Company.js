const mongoose = require("mongoose");

const companySchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Le nom de l'entreprise est obligatoire"],
      trim: true,
    },
    sector: {
      type: String,
      required: [true, "Le secteur d'activité est obligatoire"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "L'adresse est obligatoire"],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    website: {
      type: String,
      match: [/^(https?:\/\/)?([a-z0-9]+([-\w]*[a-z0-9])*\.)+[a-z]{2,6}$/, "URL invalide"],
    },
    description: {
      type: String,
      default: "Pas de description fournie",
    },
    yearFounded: {
      type: Date,
      required: [true, "La date de création est obligatoire"],
    },
    employeeCount: {
      type: String,
      required: false,
    },
    internships: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        requirements: { type: [String], default: [] },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        postedDate: { type: Date, required: true },
        isActive: { type: Boolean, default: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Company", companySchema);
