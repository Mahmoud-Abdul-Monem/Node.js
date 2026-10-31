import { Router } from 'express';
import { Movie } from "../models/Movie.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
import { checkAuth } from "../middleware/checkAuth.js";
import { Review } from '../models/Review.js';
import { upload } from '../middleware/upload.js';
import { validateBody } from '../middleware/validateBody.js';
import { createMovieSchema, updateMovieSchema } from '../validation-schemas/movie.schema.js';

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const { actor, search } = req.query;
        let query = {};

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        if (actor) {
            query.actors = actor;
        }

        const data = await Movie.find(query).populate("actors");
        return res.status(200).json({ data });
    } catch (error) {
        next(error);
    }
});

router.get('/:id', validateObjectId('id'), async (req, res, next) => {
    try {
        const movie = await Movie.findById(req.params.id)
            .populate("actors")
            .populate({
                path: "reviews",
                populate: { path: "user", select: "username image" }
            });

        if (!movie) {
            return res.status(404).json({ error: "movie not found" });
        }

        return res.status(200).json({ data: movie });
    } catch (error) {
        next(error);
    }
});
router.post('/', checkAuth, upload.single('image'), validateBody(createMovieSchema), async (req, res, next) => {
    try {
        const image = req.file ? req.file.filename : null;

        const movieData = {
            ...req.body,
            image
        };

        const data = await Movie.create(movieData);
        return res.status(201).json({
            message: "movie created successfully",
            data: data
        });
    } catch (error) {
        next(error);
    }
});

router.patch('/:id', checkAuth, validateObjectId('id'), upload.single('image'), validateBody(updateMovieSchema), async (req, res, next) => {
    try {
        const id = req.params.id;
        const updateData = { ...req.body };

        if (req.file) {
            updateData.image = req.file.filename;
        }

        const updatedMovie = await Movie.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate("actors");

        if (!updatedMovie) {
            return res.status(404).json({ error: "movie not found" });
        }

        return res.status(200).json({
            message: "movie updated successfully",
            data: updatedMovie
        });
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', checkAuth, validateObjectId('id'), async (req, res, next) => {
    try {
        const id = req.params.id;
        const movie = await Movie.findByIdAndDelete(id);

        if (!movie) {
            return res.status(404).json({ error: "movie not found" });
        }

        return res.status(200).json({
            message: "movie deleted successfully"
        });
    } catch (error) {
        next(error);
    }
});

router.post('/:id/reviews', checkAuth, validateObjectId('id'), async (req, res, next) => {
    try {
        const movieId = req.params.id;

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ error: "movie not found" });
        }

        const review = await Review.createReview(movieId, req.user._id, req.body);

        return res.status(201).json({
            message: "review added successfully",
            data: review
        });
    } catch (error) {
        next(error);
    }
});

export default router;