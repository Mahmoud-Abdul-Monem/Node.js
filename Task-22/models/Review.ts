import mongoose, { Document, Model } from 'mongoose';

export interface IReview extends Document {
    number: number;
    comment: string;
    movie: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

interface IReviewModel extends Model<IReview> {
    findByMovie(movieId: string): Promise<IReview[]>;
    findByUser(userId: string): Promise<IReview[]>;
    createReview(movieId: string, userId: string, reviewData: any): Promise<IReview>;
}

const reviewSchema = new mongoose.Schema({
    number: { type: Number, required: true, min: 0, max: 10 },
    comment: { type: String, trim: true, default: '' },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

reviewSchema.statics.findByMovie = function (movieId: string) {
    return this.find({ movie: movieId }).populate('user', 'username image');
};

reviewSchema.statics.findByUser = function (userId: string) {
    return this.find({ user: userId }).populate('movie', 'title year image');
};

reviewSchema.statics.createReview = async function (movieId: string, userId: string, reviewData: any) {
    const review = await this.create({
        ...reviewData,
        movie: movieId,
        user: userId
    });
    return review;
};

export const Review = mongoose.model<IReview, IReviewModel>('Review', reviewSchema);