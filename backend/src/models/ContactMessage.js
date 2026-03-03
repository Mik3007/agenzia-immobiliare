import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    message: { type: String, required: true },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", default: null }, // se contattano per un annuncio specifico
  },
  { timestamps: true }
);

export default mongoose.model("ContactMessage", contactMessageSchema);
