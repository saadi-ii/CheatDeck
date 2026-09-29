import mongoose, { Schema, type InferSchemaType } from "mongoose";
import { BLOCK_TYPES } from "./cheatsheet.model.js";

export const SUGGESTION_TYPES = ["edit", "add"] as const;
export const SUGGESTION_STATUSES = ["pending", "accepted", "rejected"] as const;

// A community member's proposed change to a published cheatsheet. Nothing here is shown on the
// public site until an admin accepts it (which copies it into the cheatsheet document).
const suggestionSchema = new Schema(
  {
    type: { type: String, enum: SUGGESTION_TYPES, required: true },
    status: { type: String, enum: SUGGESTION_STATUSES, default: "pending", index: true },

    cheatsheetSlug: { type: String, required: true },
    sectionId: { type: String, required: true },
    /** "edit" only: the block being changed. */
    blockId: { type: String },

    /** The proposed block content. For "edit" this is the block's own type. */
    blockType: { type: String, enum: BLOCK_TYPES, required: true },
    content: { type: String, required: true },
    language: { type: String },
    /** "edit" only: the block's content when the member made the suggestion, to spot later changes. */
    baseContent: { type: String },

    note: { type: String, default: "" },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },

    reviewedAt: { type: Date },
    reviewNote: { type: String, default: "" },
  },
  { timestamps: true },
);

export type SuggestionDoc = InferSchemaType<typeof suggestionSchema>;
export const Suggestion = mongoose.model("Suggestion", suggestionSchema);
