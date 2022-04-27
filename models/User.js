const { crudControllers } = require("prattask-cmmn");

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform: function (doc, ret) {
        delete ret.password;
      },
    },
  }
);

const User = mongoose.model("user", userSchema);
exports.User = User;

module.exports = {
  userCrud: crudControllers(User),
  User,
};
