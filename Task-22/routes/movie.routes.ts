import { Router } from 'express';
import { checkAuth } from '@middleware/checkAuth.ts';
import { validateObjectId } from '@middleware/validateObjectId.ts';
import { validateBody } from '@middleware/validateBody.ts';
import { upload } from '@middleware/upload.ts';
import { createMovieSchema, updateMovieSchema } from '@validation/movie.schema.js';
import { createReviewSchema } from '@validation/review.schema.js';
import { Movie } from '@/models/Movie.ts';
import { errorRes, successRes } from '@/utils/responses.js';
import { Review } from '@/models/Review.ts';

export const movieRouter = Router();

movieRouter.get('/', async (req, res) => {
    const { actor, search } = req.query;
    let query: any = {};

    if (search) {
        query.title = { $regex: search, $options: 'i' };
    }

    if (actor) {
        query.actors = actor;
    }

    const data = await Movie.find(query).populate("actors");
    return successRes(res, data);

});

movieRouter.get('/:id', validateObjectId('id'), async (req, res) => {
    const id = req.params.id
    const movie = await Movie.findById(id)
        .populate("actors")
        .populate(
            { path: "reviews", populate: { path: "user", select: "username image" } }
        )

    if (!movie) {
        return errorRes(res, "movie not found", 404);
    }
    return successRes(res, movie);

});

movieRouter.post('/', checkAuth, upload.single('image'), validateBody(createMovieSchema), async (req, res) => {
    const movie = new Movie({
        ...req.body,
        image: req.file?.filename ?? null,
    });

    await movie.save();

    return successRes(res, movie, "movie created successfully", 201);

});

movieRouter.patch('/:id', checkAuth, validateObjectId('id'), upload.single('image'), validateBody(updateMovieSchema), async (req, res) => {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
        return errorRes(res, 'movie not found', 404);
    }

    Object.assign(movie, req.body);

    if (req.file) {
        movie.image = req.file.filename;
    }

    await movie.save();

    return successRes(res, movie, 'movie updated successfully');
}
);

movieRouter.delete('/:id', checkAuth, validateObjectId('id'), async (req, res) => {
    const id = req.params.id
    const movie = await Movie.findByIdAndDelete(id);

    if (!movie) {
        return errorRes(res, "movie not found", 404);
    }

    return successRes(res, null, "movie deleted successfully", 200);

});

movieRouter.post('/:id/reviews', checkAuth, validateObjectId('id'), validateBody(createReviewSchema), async (req, res) => {
    const id = req.params.id;
    if (typeof id !== 'string') {
        return errorRes(res, 'invalid id', 400);
    }

    const user = req.user;

    if (!user) {
        return errorRes(res, 'Unauthorized', 401);
    }

    const movie = await Movie.findById(id);
    if (!movie) {
        return errorRes(res, 'movie not found', 404);
    }

    const review = await Review.createReview(id, user._id, req.body);
    return successRes(res, review, "review added successfully", 201);
});
