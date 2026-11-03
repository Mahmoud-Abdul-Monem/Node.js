import mongoose from "mongoose";
import bcrypt from "bcrypt"
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    image?: string;
    resetOtp?: string;
    resetOtpExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: [2, "Username must be at least 2 characters"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"]
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (v: string) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
            },
            message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        }
    },
    image: { type: String },
    resetOtp: { type: String },
    resetOtpExpires: { type: Date }
}, { timestamps: true });



userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);

});

export const User = mongoose.model<IUser>("User", userSchema);
