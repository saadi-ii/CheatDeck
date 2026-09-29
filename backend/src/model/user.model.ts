import mongoose, { Schema } from "mongoose";

export const PROVIDERS = ["github", "google"] as const;

// Community members who signed in with GitHub or Google. We keep only what the UI needs:
// no email address and no access token.
const userSchema = new Schema(
  {
    provider: { type: String, enum: PROVIDERS, required: true },
    providerId: { type: String, required: true },
    name: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    banned: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.index({ provider: 1, providerId: 1 }, { unique: true });

export const User = mongoose.model("User", userSchema);
