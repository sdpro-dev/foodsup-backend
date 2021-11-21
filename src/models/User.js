const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    email: String,
    phone: String,
    company: String,
    role: String,
    hashed_password: String
});

mongoose.model('User', UserSchema);