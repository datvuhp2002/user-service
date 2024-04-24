const { model, Schema } = require("mongoose");
const DOCUMENT_NAME = "Role";
const COLLECTION_NAME = "Roles";
// Declare the Schema of the Mongo model
var roleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["1111", "0011", "0000"],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, roleSchema);
