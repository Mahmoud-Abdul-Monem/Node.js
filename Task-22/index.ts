process.loadEnvFile();

import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { connectToMongoDB } from '@db/index.ts';

import { authRouter } from '@routes/auth.routes.ts';
import { movieRouter } from '@routes/movie.routes.ts';
import { actorRouter } from '@routes/actor.routes.ts';
import { reviewRouter } from '@routes/review.routes.ts';
import { pagesRouter } from '@routes/pages.routes.ts';

const app = express();
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(new Date().toLocaleString(), req.method, req.url);
  next();
});

await connectToMongoDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI as string,
      collectionName: 'sessions',
    }),
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use('/auth', authRouter);
app.use('/api/movies', movieRouter);
app.use('/api/actors', actorRouter);
app.use('/api/reviews', reviewRouter);
app.use('/', pagesRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log('err', err);
  res.status(500).json({ error: 'something went wrong' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});