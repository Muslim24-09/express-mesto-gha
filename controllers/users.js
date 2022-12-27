// const getUsers = (req, res, next) => {
//   // ...
// };

// const createUser = (req, res, next) => {
//   // ...
// };

// const updateUserProfile = (req, res, next) => {
//   // ...
// };

// const deleteUser = (req, res, next) => {
//   // ...
// };

// module.exports = {
//   getUsers,
//   createUser,
//   updateUserProfile,
//   deleteUser,
// };

// const User = require('../models/user');

// module.exports.getUser = (req, res) => {
//   User.findById(req.params.userId)
//     .then((user) => res.send(user))
//     .catch(err);
// };

// module.exports.getUsers = (req, res, next) => {
//   User.find({})
//     .then((users) => res.send(users))
//     .catch(err);
// };

// module.exports.createUser = (req, res, next) => {
//   const {
//     name, about, avatar,
//   } = req.body;

//   const createUser = () => User.create({
//     name,
//     about,
//     avatar,
//   });
// };
