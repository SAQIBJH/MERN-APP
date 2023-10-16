const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm-R4c-jnJRMpKve4e7mVawuYbGOgzX5SPWUWwCznT&s",
    },
  },
  {
    timestamps: true,
  }
);

// match password functionality
userSchema.methods.matchPassword = async function (enteredpassword) {
  return await bcrypt.compare(enteredpassword, this.password);
};

// before saving i want to hash the password

// isModified is a function in mongoose which check a specific field is modified or not
userSchema.pre('save',async function(next) {
    if (!this.ismodified)next();  
    this.password = bcrypt.hashSync(this.password,10)
    //   const salt = await bcrypt.genSalt(10);
    //   this.password = await bcrypt.hash(this.password, salt);
}
    )


const User = mongoose.model("User", userSchema);

module.exports = User;
