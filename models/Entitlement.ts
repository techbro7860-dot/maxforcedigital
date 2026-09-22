import mongoose, { Schema, models, model } from "mongoose";

export interface IEntitlement {
  _id: string;
  user: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  productTitle: string;
  productType: "course" | "ebook";
  deliveryMode: "secure_download" | "external_link";
  isActive: boolean;
  grantedAt: Date;
  revokedAt?: Date;
  lastAccessedAt?: Date;
  accessCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const EntitlementSchema = new Schema<IEntitlement>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    productTitle: { type: String, required: true },
    productType: { type: String, enum: ["course", "ebook"], required: true },
    deliveryMode: { type: String, enum: ["secure_download", "external_link"], required: true },
    isActive: { type: Boolean, default: true },
    grantedAt: { type: Date, required: true, default: Date.now },
    revokedAt: { type: Date },
    lastAccessedAt: { type: Date },
    accessCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// The same payment may be confirmed by the browser and webhook concurrently.
// This compound key makes entitlement creation safely idempotent.
EntitlementSchema.index({ user: 1, order: 1, product: 1 }, { unique: true });
EntitlementSchema.index({ user: 1, isActive: 1, createdAt: -1 });

export default models.Entitlement || model<IEntitlement>("Entitlement", EntitlementSchema);
