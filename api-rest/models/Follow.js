const { Schema, model } =  require("mongoose");

const FollowSchema = Schema({
    name: {
        type: String,
        required: true
    },
    surname: String,
    username: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    role:{
        type: String,
        default: "role_user"
    },
    image: { 
        type: String,
        default: "default.png"
    },
    created_at: {
        type: Date,
        default: Date.now
    }

})

module.exports = model("Follow", FollowSchema, "follows");