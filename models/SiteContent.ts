import { Schema, model, models } from "mongoose";

const StatSchema = new Schema({ value: String, label: String }, { _id: false });
const ValueSchema = new Schema({ title: String, description: String }, { _id: false });
const TeamMemberSchema = new Schema(
  { name: String, role: String, bio: String, image: String },
  { _id: false }
);
const OfferingSchema = new Schema(
  {
    slug: { type: String, required: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    summary: { type: String, default: "" },
    body: { type: String, default: "" },
    features: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);
const PolicySchema = new Schema(
  { slug: String, title: String, body: String },
  { _id: false }
);

const SiteContentSchema = new Schema(
  {
    singletonKey: { type: String, default: "main", unique: true, index: true },
    about: {
      title: { type: String, default: "About Maxforce Digital" },
      intro: { type: String, default: "" },
      mission: { type: String, default: "" },
      vision: { type: String, default: "" },
      stats: { type: [StatSchema], default: [] },
      values: { type: [ValueSchema], default: [] },
      team: { type: [TeamMemberSchema], default: [] },
    },
    contact: {
      title: { type: String, default: "Let's build something valuable" },
      intro: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
      mapUrl: { type: String, default: "" },
    },
    services: { type: [OfferingSchema], default: [] },
    industries: { type: [OfferingSchema], default: [] },
    policies: { type: [PolicySchema], default: [] },
  },
  { timestamps: true }
);

export default models.SiteContent || model("SiteContent", SiteContentSchema);
