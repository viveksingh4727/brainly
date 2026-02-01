import mongoose, { Model, Schema } from "mongoose";


const UserModel = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

export const UserSchema = new Model('User', UserModel);