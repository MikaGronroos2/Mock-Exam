const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

userSchema.statics.signup = async function (email, password) {
    // Checks incase invalid details
    if (!email || !password ) {
        throw Error("All fields must be filled")
    }
    if (!validator.isEmail(email)) {
        throw Error("Email is Invalid")
    }
    if (!validator.isStrongPassword(password)) {
        throw Error("Password is not strong enough for use")
    }

    // Checking if email is already in use by another person
    const exists = await this.findOne({ email});
    if (exists) {
        throw Error("Email is already in use by another user")
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ email, password: hash})

    return user;
};

userSchema.statics.login = async function (email, password) {
    // Checks incase invalid details
    if (!email || !password ) {
        throw Error("All fields must be filled")
    }
    
    // Checking DB for the email
    const user = await this.findOne({ email });
    if (!user) {
        throw Error("Invalid Email")
    }

    // Comparing the password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error("Invalid Password")
    }

    return user;
};

module.exports = mongoose.model("User", userSchema);