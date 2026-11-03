import mongoose from 'mongoose';
import { Review } from './Review.js';
const movieSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true, index: true },
         year: { type: Number, required: true },
        genres: { type: [String], required: true },
        description: { type: String, required: true },
        trailerLink: { type: String, required: true },
        image: { type: String, default: null },
        director: { type: String, required: true, trim: true },
        actors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actor' }],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

movieSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'movie',
});

movieSchema.pre('findOneAndDelete', async function (next) {
    const docToDel = await this.model.findOne(this.getFilter());
    if (docToDel) {
        await Review.deleteMany({ movie: docToDel._id });
    }
    next();
});



movieSchema.statics.updateMovie = function (id, updateData) {
    return this.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    );
};
;
export const Movie = mongoose.model('Movie', movieSchema);