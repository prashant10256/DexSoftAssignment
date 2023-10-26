const express = require("express");
const multer = require("multer");
const csvParser = require("csv-parser");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage })

const jwt = require("jsonwebtoken");
const jwtSecret = "14546678";
const cookieParser = require("cookie-parser");

const {
  bookInfo,
  registerUser,
  deleteBook,
  updateImage,
  updateBook,
  userImage,
  jsontocsv,
  downloadCSVData,
  uploadBook,
  uploadcsvFile
} = require("../Controller/userController");

const router = express.Router();

const users = {
  user1: "password1",
  user2: "password2",
};


const isAuthenticated = (req, res, next) => {

  if (req.cookies.token) {
    jwt.verify(req.cookies.token, jwtSecret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized access!" });
        res.redirect("/");
      }

      // User is authenticated, proceed with the API logic
      return next();
    });
  } else {
    // User is not authenticated, return an error response
    res.status(401).json({ error: "Unauthorized access!" });
    res.redirect("/");
  }
};

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if the provided credentials are valid
  if (users[username] === password) {
    const token = jwt.sign({ username }, jwtSecret, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true }); 
    res.redirect("/allUsers");
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

router.get("/details", bookInfo);
router.get("/image/:userId",isAuthenticated, userImage);
router.post("/insert",registerUser);
router.delete("/delete/:bookId", deleteBook);
router.put("/update/:bookId",  updateBook);
router.put("/updateimage/:bookId", updateImage);

router.get("/jsontocsv", jsontocsv)

router.get("/csvtojson", downloadCSVData)

// router.post("/uploadBook",
// mainFile.single("file"), uploadBook)

router.post("/uploadcsvFile",
upload.single("file"),uploadcsvFile)

// app.post("/upload-csv", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded." });
//     }

//     const csvData = req.file.buffer.toString("utf8");

//     // Process the CSV data here, validate columns, and update MongoDB using Mongoose.

//     // Example: parsing and inserting data into the "Books" collection
//     const results = [];
//     csvParser({ mapHeaders: ({ header }) => header.trim() })
//       .on("data", (row) => results.push(row))
//       .on("end", () => {
//         // Assuming that CSV columns match your schema fields
//         booksModel.create(results, (err, docs) => {
//           if (err) {
//             console.error("Error inserting data into MongoDB: ", err);
//             return res.status(500).json({ message: "Internal server error." });
//           }
//           res.status(200).json({ message: "CSV data imported successfully." });
//         });
//       })
//       .write(csvData);
//   } catch (error) {
//     console.error("Error handling file upload: ", error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// });


module.exports = router;
