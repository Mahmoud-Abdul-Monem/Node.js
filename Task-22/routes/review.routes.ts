import { Router } from 'express';
import { checkAuth } from '@middleware/checkAuth.ts';
import { validateObjectId } from '@middleware/validateObjectId.ts';
import { validateBody } from '@middleware/validateBody.ts';
import { createReviewSchema, updateReviewSchema } from '@validation/review.schema.js';
import { Review } from '@/models/Review.ts';
import { errorRes, successRes } from '@/utils/responses.js';

export const reviewRouter = Router();

reviewRouter.get('/my', checkAuth, async (req, res) => {
    const data = await (Review as any).findByUser((req as any).user._id);
    return successRes(res, data);

});

reviewRouter.post('/:movieId', checkAuth, validateObjectId('movieId'), validateBody(createReviewSchema), async (req, res) => {
    const id = req.params.id;
    if (typeof id !== 'string') {
        return errorRes(res, 'invalid id', 400);
    }

    const user = req.user;
    const review = await Review.createReview(id, user._id, req.body);
    return successRes(res, review, "review added successfully", 201);
});

reviewRouter.patch('/:id', checkAuth, validateObjectId('id'), validateBody(updateReviewSchema), async (req, res) => {
    const id = req.params.id;
    const review: any = await Review.findById(id);
    if (!review) {
        return errorRes(res, "review not found", 404);
    }

    if (review.user.toString() !== (req as any).user._id.toString()) {
        return errorRes(res, "you are not authorized to update this review", 403);
    }

    Object.assign(review, req.body);
    await review.save();

    return successRes(res, review, "review updated successfully", 200);

});

reviewRouter.delete('/:id', checkAuth, validateObjectId('id'), async (req, res) => {
    const id = req.params.id;
    const review: any = await Review.findById(id);
    if (!review) {
        return errorRes(res, "review not found", 404);
    }

    if (review.user.toString() !== (req as any).user._id.toString()) {
        return errorRes(res, "you are not authorized to delete this review", 403);
    }

    await Review.findByIdAndDelete(id);

    return successRes(res, null, "review deleted successfully", 200);

});