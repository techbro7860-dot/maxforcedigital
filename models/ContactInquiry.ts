import { Schema, model, models } from "mongoose";

const ContactInquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "", trim: true },
    company: { type: String, default: "", trim: true },
    service: { type: String, default: "", trim: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
      index: true,
    },
  },
  { timestamps: true }
);

ContactInquirySchema.index({ createdAt: -1 });
export default models.ContactInquiry || model("ContactInquiry", ContactInquirySchema);
