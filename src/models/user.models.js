"use strict";

// !dmbg
const { model, Schema } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";
// Declare the Schema of the Mongo model
var userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
    },
    name: String,
    phoneNumber: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    roles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    avatar: String,
    birthday: Schema.Types.Date,
    modifiedBy: Schema.Types.ObjectId,
    deletedAt: Schema.Types.Date,
    deletedMark: {
      type: Schema.Types.Boolean,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, userSchema);
