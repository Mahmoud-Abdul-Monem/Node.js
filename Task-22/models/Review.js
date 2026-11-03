import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        number: { type: Number, required: true, min: 0, max: 10 },
        comment: { type: String, trim: true, default: '' },
        movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

reviewSchema.statics.findByMovie = function (movieId) {
    return this.find({ movie: movieId }).populate('user', 'username image');
};

reviewSchema.statics.findByUser = function (userId) {
    return this.find({ user: userId }).populate('movie', 'title year image');
};
reviewSchema.statics.createReview = async function (movieId, userId, reviewData) {
    const review = await this.create({
        ...reviewData,
        movie: movieId,
        user: userId
    });
    return review;
}
export const Review = mongoose.model('Review', reviewSchema);