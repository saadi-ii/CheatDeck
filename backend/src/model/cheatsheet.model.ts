import { randomUUID } from "node:crypto";
import mongoose, { Schema, type InferSchemaType } from "mongoose";

export const BLOCK_TYPES = ["text", "code"] as const;

const blockSchema = new Schema(
  {
    id: { type: String, default: () => randomUUID() },
    type: { type: String, enum: BLOCK_TYPES, required: true },
    content: { type: String, default: "" },
    language: { type: String },
    runnable: { type: Boolean, default: false },
  },
  { _id: false },
);

const sectionSchema = new Schema(
  {
    id: { type: String, default: () => randomUUID() },
    title: { type: String, required: true, trim: true },
    blocks: { type: [blockSchema], default: [] },
  },
  { _id: false },
);

const cheatsheetSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    icon: { type: String, default: "" },
    description: { type: String, default: "" },
    version: { type: String, default: "" },
    published: { type: Boolean, default: false },
    sections: { type: [sectionSchema], default: [] },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

export type CheatsheetDoc = InferSchemaType<typeof cheatsheetSchema>;
export const Cheatsheet = mongoose.model("Cheatsheet", cheatsheetSchema);
