const express = require('express');
const router = express.Router();

const {
  register,
  updatePassword,
  updateData,
  login,
} = require('../controller/userController');

/* Register User Route */
router.route('/register').post(register);
/* Update or Set Password */
router.route('/updatePassword').post(updatePassword);
/* Update User Profile */
router.route('/updateProfile').post(updateData);
/* User Login */
router.route('/login').post(login);

module.exports = router;
