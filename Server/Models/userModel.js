// const mongoose = require("mongoose");

// const all_Users = new mongoose.Schema(
//   {
//     user_id: { type: String },
//     user_name: { type: String },
//     user_email: { type: String },
//     user_password: { type: String },
//     user_image: { type: String },
//     total_orders: { type: Number },
//     created_at: { type: String },
//     last_logged_in: { type: String },
//   },
//   {
//     timestamps: true,
//     toObject: {
//       transform: function (doc, ret, options) {
//         ret.id = ret._id;
//         delete ret._id;
//         delete ret.__v;
//         return ret;
//       },
//     },
//   }
// );
// const userModel = mongoose.model("User", all_Users);
// module.exports = userModel;
