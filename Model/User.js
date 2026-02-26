const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
   {
    username: {
      type: String,
      required: function() {
        return !this.googleId; // Only required for local authentication
      },
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: function() {
        return !this.googleId; // Only required for local authentication
      },
      minlength: 6,
    },
  
    googleId: {
      type: String,
      sparse: true, // Allows multiple nulls but enforces uniqueness for non-null
    },
  
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Compound index to ensure email uniqueness per authentication method
userSchema.index({ email: 1, googleId: 1 }, { unique: true });


module.exports = mongoose.model('User', userSchema);