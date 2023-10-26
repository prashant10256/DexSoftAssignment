const all_books = require("../Models/BooksModel");

module.exports.getBooks = async (data) => {
  try {
    const books = await all_books.find({});
    return books;
  } catch (error) {
    return error;
  }
};
