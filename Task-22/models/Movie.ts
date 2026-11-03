import mongoose, { Document, Model } from 'mongoose';
import { Review } from '@models/Review.ts';

export interface IMovie extends Document {
    title: string;
    year: number;
    genres: string[];
    description: string;
    trailerLink: string;
    image?: string | null;
    director: string;
    actors: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, index: true },
    year: { type: Number, required: true },
    genres: { type: [String], required: true },
    description: { type: String, required: true },
    trailerLink: { type: String, required: true },
    image: { type: String, default: null },
    director: { type: String, required: true, trim: true },
    actors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actor' }],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

movieSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'movie',
});

movieSchema.pre('findOneAndDelete', async function () {
    const docToDel = await (this as any).model.findOne((this as any).getFilter());
    if (docToDel) {
        await Review.deleteMany({ movie: docToDel._id });
    }
});



export const Movie = mongoose.model<IMovie>('Movie', movieSchema);
