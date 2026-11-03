import { Router } from 'express';
import { checkAuth } from '@middleware/checkAuth.ts';
import { validateObjectId } from '@middleware/validateObjectId.ts';
import { validateBody } from '@middleware/validateBody.ts';
import { upload } from '@middleware/upload.ts';
import { createActorSchema, updateActorSchema } from '@validation/actor.schema.js';
import { errorRes, successRes } from '@/utils/responses.js';
import { Actor } from '@/models/Actor.ts';

export const actorRouter = Router();

actorRouter.get('/', async (req, res) => {
    const { search } = req.query;
    let query: any = {};
    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }
    const data = await Actor.find(query);
    return successRes(res, data);

});

actorRouter.get('/:id', validateObjectId('id'), async (req, res) => {
    const id = req.params.id;
    const data = await Actor.findById(id).populate("movies", "title year image");
    if (!data) {
        return errorRes(res, "actor not found", 404);
    }
    return successRes(res, data);

});

actorRouter.post('/', checkAuth, upload.array('images', 5), validateBody(createActorSchema), async (req, res) => {
    const { name, birthdate } = req.body;
    const files = req.files as Express.Multer.File[];
    const images = files ? files.map(file => file.filename) : [];

    const actor = await Actor.create({
        name,
        birthdate,
        images
    });

    return successRes(res, actor, "actor created successfully", 201);

});

actorRouter.patch('/:id', checkAuth, validateObjectId('id'), upload.array('images', 5), validateBody(updateActorSchema), async (req, res) => {
    const id = req.params.id;
    const actor = await Actor.findById(id);
    if (!actor) {
        return errorRes(res, "actor not found", 404);
    }

    const updateData: any = { ...req.body };
    const files = req.files as Express.Multer.File[];
    if (files && files.length > 0) {
        updateData.images = files.map(file => file.filename);
    }

    const updatedActor = await Actor.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    return successRes(res, updatedActor, "actor updated successfully", 200);

});

actorRouter.delete('/:id', validateObjectId('id'), async (req, res) => {
    const id = req.params.id;
    const actor = await Actor.findById(id);
    if (!actor) {
        return errorRes(res, "actor not found", 404);
    }

    await Actor.findByIdAndDelete(id);

    return successRes(res, null, "actor deleted successfully", 200);

});