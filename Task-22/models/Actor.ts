import mongoose, { Document } from "mongoose";
import { Movie } from "@models/Movie.ts";
export interface IActor extends Document {
    name: string;
    images: string[];
    birthdate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const actorSchema = new mongoose.Schema({
    name: { type: String, required: true , index:true},
    images: [String],
    birthdate: Date,

}, {
    timestamps: true,
    toJson: { virtuals: true },
    toObject: { virtuals: true },
})

actorSchema.virtual("movies", {
    ref: "Movie",
    localField: "_id",
    foreignField: "actors",
})

actorSchema.pre("findOneAndDelete", async function () {
    const actorId = this.getFilter()._id;

    if (!actorId) {
        return;
    }

    await Movie.updateMany(
        { actors: actorId },
        { $pull: { actors: actorId } }
    );
});


export const Actor = mongoose.model<IActor>("Actors" , actorSchema)
