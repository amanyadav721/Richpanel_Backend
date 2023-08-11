import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
            min: 5,
        },
        email: {
            type: String,
            require: true,
            max: 100,
            unique: true,
        },
        password: {
            type: String,
            require: true,
            min: 5,
        },
        tokens: [{ type: Object }]
    },
    { timestamps: true },
);

const User = mongoose.model("User", UserSchema);
export default User;