const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'user',
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    profileImage: {
      type: String,
      default:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRlzB_9muIg5yjDIsYV6JGerdf4f8PxfLJvQMrN64&s',
    },
    address: {
      type: String,
    },
    password: {
      type: String,
    },
    accessToken: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
    },
    role: {
      type: String,
      enum: ['user', 'client', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  // Generate salt
  const salt = await bcrypt.genSalt(10);
  // Hash the password
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Update password using bcrypt

userSchema.methods.genHash = async function (password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

// Sign JWT and return

userSchema.methods.getSignedJwtToken = function (id) {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Check access token is expired or not

userSchema.methods.isTokenExpired = function (token) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    return true;
  } else {
    return false;
  }
};

// Match user entered password to hashed password in database

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Geocode and create location field

userSchema.methods.genLocation = function (lat, lng) {
  return {
    type: 'Point',
    // geoJSON expects lng first then lat
    coordinates: [lng, lat],
  };
};

module.exports = mongoose.model('User', userSchema);
