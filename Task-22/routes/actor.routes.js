import { Router } from 'express';
import { Actor } from '../models/Actor.js';
import { validateObjectId } from '../middleware/validateObjectId.js';
import { checkAuth } from '../middleware/checkAuth.js';
import { upload } from '../middleware/upload.js';
import { validateBody } from '../middleware/validateBody.js';
import { createActorSchema, updateActorSchema } from '../validation-schemas/actor.schema.js';

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        const data = await Actor.find(query);
        return res.status(200).json({ data });
    } catch (err) {
        next(err);
    }
});

router.get('/:id', validateObjectId('id'), async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await Actor.findById(id).populate("movies", "title year image");
        if (!data) {
            return res.status(404).json({ error: "actor not found" });
        }
        return res.status(200).json({ data });
    } catch (err) {
        next(err);
    }
});

router.post('/', checkAuth, upload.array('images', 5), validateBody(createActorSchema), async (req, res, next) => {
    try {
        const { name, birthdate } = req.body;
        const images = req.files ? req.files.map(file => file.filename) : [];

        const actor = await Actor.create({
            name,
            birthdate,
            images
        });

        return res.status(201).json({
            message: "actor created successfully",
            data: actor
        });
    } catch (err) {
        next(err);
    }
});

router.patch('/:id', checkAuth, validateObjectId('id'), upload.array('images', 5), validateBody(updateActorSchema), async (req, res, next) => {
    try {
        const id = req.params.id;
        const actor = await Actor.findById(id);
        if (!actor) {
            return res.status(404).json({ error: "actor not found" });
        }

        const updateData = { ...req.body };
        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(file => file.filename);
        }

        const updatedActor = await Actor.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        return res.status(200).json({
            message: "actor updated successfully",
            data: updatedActor
        });
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', checkAuth, validateObjectId('id'), async (req, res, next) => {
    try {
        const id = req.params.id;
        const actor = await Actor.findById(id);
        if (!actor) {
            return res.status(404).json({ error: "actor not found" });
        }

        await Actor.findByIdAndDelete(id);

        return res.status(200).json({
            message: "actor deleted successfully"
        });
    } catch (err) {
        next(err);
    }
});

export default router;