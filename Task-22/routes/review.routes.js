import { Router } from 'express';
import { Review } from '../models/Review.js';
import { checkAuth } from '../middleware/checkAuth.js';
import { validateObjectId } from '../middleware/validateObjectId.js';
import { validateBody } from '../middleware/validateBody.js';
import { updateReviewSchema } from '../validation-schemas/review.schema.js';

const router = Router();

router.get('/my', checkAuth, async (req, res, next) => {
    try {
        const data = await Review.findByUser(req.user._id);
        return res.status(200).json({ data });
    } catch (err) {
        next(err);
    }
});

router.patch('/:id', checkAuth, validateObjectId('id'), validateBody(updateReviewSchema), async (req, res, next) => {
    try {
        const id = req.params.id;
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ error: "review not found" });
        }

        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "you are not authorized to update this review" });
        }

        Object.assign(review, req.body);
        await review.save();

        return res.status(200).json({
            message: "review updated successfully",
            data: review
        });
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', checkAuth, validateObjectId('id'), async (req, res, next) => {
    try {
        const id = req.params.id;
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ error: "review not found" });
        }

        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "you are not authorized to delete this review" });
        }

        await Review.findByIdAndDelete(id);

        return res.status(200).json({
            message: "review deleted successfully"
        });
    } catch (err) {
        next(err);
    }
});

export default router;