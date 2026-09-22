import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface INewsletterSubscriber extends Document {
  email: string;
  status: "active" | "unsubscribed";
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterSubscriberSchema = new Schema<INewsletterSubscriber>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  status: { type: String, enum: ["active", "unsubscribed"], default: "active" },
  source: { type: String, default: "website" },
}, { timestamps: true });

const NewsletterSubscriber: Model<INewsletterSubscriber> =
  mongoose.models.NewsletterSubscriber ||
  mongoose.model<INewsletterSubscriber>("NewsletterSubscriber", NewsletterSubscriberSchema);

export default NewsletterSubscriber;
