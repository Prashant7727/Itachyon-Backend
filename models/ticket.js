const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    ticketTitle: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type: Date, required: true },
    priority: { type: String, required: true },
    file: { type: String },
    responsiblePerson: { type: String, required: true },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedBy: { type: String },
    updatedAt: { type: Date },
    participants: { type: [String] },
    observers: { type: [String] },
    taskStatusSummary: { type: String },
  },
//   { timestamps: true }
);

const User = mongoose.model("ticket", userSchema);
module.exports = User;
