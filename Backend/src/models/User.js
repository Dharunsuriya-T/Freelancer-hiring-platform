import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: { 
        type: String, 
        required: true 
    },
    username: { 
        type: String, 
        required: true, 
        unique: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    profilePic: { 
        type: String, 
        default: "" 
    },
    role: { 
        type: String, 
        enum: ['client', 'freelancer'],
        required: true 
    }
}, { 
    timestamps: true 
});

const User = mongoose.model('User', userSchema);

export default User;
