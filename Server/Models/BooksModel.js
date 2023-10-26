const mongoose = require("mongoose");

const all_books = new mongoose.Schema(
  {
    book_name: { type: String },
    author_name: { type: String },
    book_image: { type: String },
    total_orders: { type: Number },
    price: { type: Number }
  },
  {
    timestamps: true,
    toObject: {
      transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);
const booksModel = mongoose.model("Books", all_books);
module.exports = booksModel;
