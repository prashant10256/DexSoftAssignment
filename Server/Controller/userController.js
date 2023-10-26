const { getBooks } = require("../Service/userService");
const booksModel = require("../Models/BooksModel");
const bcrypt = require("bcrypt");

const csvtojson = require("csvtojson");
const csv = require("csv-parser");
const multer = require("multer");

const json2csv = require("json2csv");

const fs = require("fs");
// const results = [];

const bookInfo = async (req, res) => {
  try {
    let books = await getBooks();
    res.status(200).json(books);
  } catch (error) {}
};

const registerUser = async (req, res) => {
  try {
    const { book_name, author_name, book_image, total_orders } = req.body;

    let user = await booksModel.findOne({ user_email });

    if (user)
      return res.status(400).json("user with the given email already exits...");

    user = new booksModel({
      book_name,
      user_email,
      author_name,
      book_image,
      total_orders,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.user_password, salt);

    await user.save();
    res.status(200).json({ _id: user._id, book_name, author_name });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.bookId;

    const deleteBook = await booksModel.findById(bookId);
    if (!deleteBook) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete the user document from the database
    await booksModel.findByIdAndRemove(bookId);

    if (!deleteBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    return res.status(200).json({ message: "Book Deleted Succesfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const updateImage = async (req, res) => {
  try {
    const { book_image } = req.body;

    const bookId = req.params.bookId;
    // Update the user's image in the database
    const updateBook = await booksModel.findByIdAndUpdate(
      bookId,
      { book_image: book_image },
      { new: true }
    );

    if (!updateBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    return res.status(200).json({ message: "Book image updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const updateBook = async (req, res) => {
  try {
    const { book_name, author_name, total_orders } = req.body;

    const bookId = req.params.bookId;
    // Update the books's data in the database
    const updateBook = await booksModel.findByIdAndUpdate(
      bookId,
      { book_name, author_name, total_orders },
      { new: true }
    );
    console.log(updateBook);

    if (!updateBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    return res.status(200).json({ message: "Book data updated successfully" });

    console.log(req.body);

    res.status(200).json({ _id: book._id, book_name, author_name });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const userImage = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Update the user's data in the database
    const user = await booksModel.findById(userId);
    const book_image = user.book_image;
    res.status(200).json({ image: book_image });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const jsontocsv = async (req, res) => {
  let jsonData = await getBooks();

  if (Array.isArray(jsonData) && jsonData.length > 0) {
    console.log(jsonData);
    // Convert JSON data to CSV
    const csv = json2csv.parse(jsonData);

    // Set response headers for CSV
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=data.csv");
    res.send(csv);
  } else {
    res
      .status(400)
      .send("Invalid JSON data. Please provide an array of objects.");
  }
};

const downloadCSVData = async (req, res) => {
  let csvData = await getBooks();
  // let result = await csvData.json();
  console.log(typeof csvData);

  if (Array.isArray(csvData) && csvData.length > 0) {
    const csv = json2csv.parse(csvData);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=data.csv");
    res.send(csv);
  } else {
    res
      .status(400)
      .send("Invalid JSON data. Please provide an array of objects.");
  }
};

const uploadBook = async (req, res) => {
  try {
    if (!req.file) {
      throw new error("File not found");
    } else {
      let filePath = "";
      let oldpath = req.file.path;
      let file_date = moment().format("DD-MM-YYYY");
      let random_no = Math.floor(Math.random() * 1000000 + 1);

      let createFolder = "uploads/main.csv/";

      if (!fs.existsSync(createFolder)) fs.mkdirSync(createFolder);

      filePath = `./uploads/main.csv/ ${random_no}_${file_date}_${req.file.originalname}`;
      fs.rename(oldpath, filePath, function (err) {
        if (err) throw err;
      });
     
      res.status(400).send("csv file stored successfully");
    }
  } catch (error) {
    console.log("Something went to wrong: in controller");
    
  }
};

const uploadcsvFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const requiredColumns = ["book_name", "author_name", "price", "book_image","total_orders"];

    const file = req.file;
    const filePath = file.path;
    console.log(file, filePath);
    let hasRequiredColumns = true;

    // Read and parse the uploaded CSV file
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("headers", (headers) => {
        hasRequiredColumns = requiredColumns.every((column) =>
          headers.includes(column.trim())
        );
      })
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", () => {
        // Insert the parsed data into the MongoDB collection using the BooksModel
        if (hasRequiredColumns) {
          booksModel
            .insertMany(results)
            .then(() => {
              console.log("Data inserted successfully");
              res.status(200).send("Data uploaded and processed successfully.");
            })
            .catch((error) => {
              console.error("Error inserting data:", error);
              res.status(500).send("Error uploading and processing data.");
            });
        } else {
          console.error("The uploaded CSV does not have the required columns.");
          res
            .status(400)
            .send("The uploaded CSV does not have the required columns.");
        }
      });
  } catch (error) {
    console.error("Error handling file upload: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  bookInfo,
  registerUser,
  deleteBook,
  updateImage,
  updateBook,
  userImage,
  jsontocsv,
  downloadCSVData,
  uploadBook,
  uploadcsvFile,
};
