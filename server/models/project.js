import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    link: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
