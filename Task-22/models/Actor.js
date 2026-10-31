import mongoose from "mongoose";

const actorSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true }
    ,
    images: {
        type: [String]
    },
    birthdate: {
        type: Date
    }
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

actorSchema.virtual("movies", {
    ref: "Movie",
    localField: "_id",
    foreignField: "actors"
});

export const Actor = mongoose.model("Actor", actorSchema);