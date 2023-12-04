const User = require('../model/userModel');
const { use } = require('../routes/userRoutes');

/* 
*
@desc Register a user
@route POST /api/v1/users/register
@access Public
*
*/

const register = async (req, res) => {
  try {
    const { phone, role } = req.body;
    const user = await User.findOne({ phone });
    if (user) {
      return res.status(400).json({
        message: 'User already exists',
        user
      });
    }
    const newUser = await User.create({
      phone,
      role,
    });
    res.status(201).json({
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

/*
*
@desc Update or Set Password
@route POST /api/v1/users/updatePassword
@access Public
*
*/

const updatePassword = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });

    if (password.length < 6 || password.length > 16) {
      return res.status(400).json({
        message: 'Password must be between 6 and 16 characters',
      });
    }

    if (user) {
      const hash = await user.genHash(password);
      const accessToken = await user.getSignedJwtToken(user._id);
      const newUser = await User.findOneAndUpdate(
        { phone },
        { password: hash, accessToken },
        { new: true }
      );

      if (newUser) {
        res.status(200).json({
          user: newUser,
          message: 'Password updated successfully!',
        });
      } else {
        res.status(403).json({
          message: 'Password update failed!',
        });
      }
    } else {
      res.status(404).json({
        message: 'User not yet registered!',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

/*
*
@desc Update User Profile
@route POST /api/v1/users/updateProfile
@access Public
*
*/

const updateData = async (req, res) => {
  try {
    const { phone, name, email, address, profileImage } = req.body;
    const { location } = req.body;

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        message: 'User not yet registered!',
      });
    }

    let locationData = {};

    if (location) {
      locationData = user.genLocation(location?.lat, location?.lng);
    }

    const newUser = await User.findOneAndUpdate(
      { phone },
      {
        name,
        email,
        address,
        profileImage,
        location: locationData,
      },
      { new: true }
    );

    if (newUser) {
      res.status(200).json({
        user: newUser,
        message: 'User data updated successfully!',
      });
    } else {
      res.status(403).json({
        message: 'User data update failed!',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong! Please try again later.',
    });
  }
};

/*
*
@desc Login a user
@route POST /api/v1/users/login
@access Public
*
*/

const login = async (req, res) => {
  try {
    const { phone, email, password } = req.body;

    if (!phone && !email) {
      return res.status(400).json({
        message: 'Please provide phone or email',
      });
    }

    if (!password) {
      return res.status(400).json({
        message: 'Please provide password',
      });
    }

    const user = await User.findOne({ $or: [{ phone }, { email }] });

    if (!user) {
      return res.status(404).json({
        message: 'User not yet registered!',
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials!',
      });
    }

    const accessToken = await user.getSignedJwtToken(user._id);
    const newUser = await User.findOneAndUpdate(
      { $or: [{ phone }, { email }] },
      { accessToken },
      { new: true }
    );

    res.status(200).json({
      user: newUser,
      message: 'Login successful!',
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

/*
*
@desc Check if a user with the given phone number exists
@route POST /api/v1/users/checkExists
@access Public
*
*/

const checkUserExists = async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone });

    if (user) {
      // User already exists
      res.status(200).json({
        message: 'User already exists',
        user: user,
      });
    } else {
      // User doesn't exist
      res.status(404).json({
        message: 'User not yet registered',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

module.exports = {
  register,
  updatePassword,
  updateData,
  login,
  checkUserExists
};
