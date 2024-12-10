const mongoose = require("mongoose");

const studentSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true 
    },
    firstName: {
      type: String,
    
    },
    lastName: {
      type: String,
     
    },
    specialite: { 
        type: String,
      },
    location: { 
        type: String,
      
      },
    phone: {
      type: String,
 
    },
    bio: {
      type: String,
    
    },
    education: [
      {
        degree: {
          type: String,
          enum: ["Bac", "Licence", "Master", "Ingénierie", "Doctorat"], 
          default: "Bac",
          required: true
        },
        institution: {
          type: String,
          required: true
        },
        specialite: { 
          type: String,
          required: true
        },
        institution: {  
          type: mongoose.Schema.Types.ObjectId,
          ref: "Institution",
          required: true
        },
        startDate: {
          type: Date,
          required: true
        },
        endDate: {
          type: Date,
          required: true
        }
      }
    ],
    skills: [
        {
          name: {
            type: String,
            required: true ,
          },
          percentage: {
            type: Number,
            required: true,
            min: 0,
            max: 100 
          }
        }
      ],
    experience: [
      {
        jobTitle: {
          type: String,
          required: true
        },
        company: {
          type: String,
          required: true
        },
        startDate: {
          type: Date,
          required: true
        },
        endDate: {
          type: Date,
          required: true
        },
        responsibilities: {
          type: [String],
          default: []
        }
      }
    ],
    attachments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attachment"
      }
    ], 
  },
  {
    timestamps: true 
  }
);

module.exports = mongoose.model("Student", studentSchema);
