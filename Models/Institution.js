const mongoose = require('mongoose'); 

const institutionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true
  }
);

const Institution = mongoose.model("Institution", institutionSchema);

module.exports = Institution; 
