const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noteSchema = new Schema({
  job_app_id: { type: Schema.Types.ObjectId, ref: "JobApplication" },
  note_content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const jobApplicationSchema = new Schema({
  job_app_id: Object,
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  company_name: { type: String, required: true },
  job_title: { type: String, required: true },
  job_description: { type: String, required: true },
  status: {
    type: String,
    enum: ["wishlist", "applied", "interview", "offer", "rejected"],
    default: "wishlist",
  },
  notes: [noteSchema],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("JobApplication", jobApplicationSchema);