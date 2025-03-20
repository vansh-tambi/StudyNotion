const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        }
    ]
});

module.exports = mongoose.model("Cart", cartSchema);