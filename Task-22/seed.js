process.loadEnvFile();

import dns from 'node:dns';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    image: { type: String },
    resetOtp: { type: String },
    resetOtpExpires: { type: Date }
}, { timestamps: true });

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

const actorSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true },
    images: [String],
    birthdate: Date,
}, { timestamps: true });

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, index: true },
    year: { type: Number, required: true },
    genres: { type: [String], required: true },
    description: { type: String, required: true },
    trailerLink: { type: String, required: true },
    image: { type: String, default: null },
    director: { type: String, required: true, trim: true },
    actors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actors' }],
}, { timestamps: true });

const reviewSchema = new mongoose.Schema({
    number: { type: Number, required: true, min: 0, max: 10 },
    comment: { type: String, trim: true, default: '' },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Actor = mongoose.models.Actors || mongoose.model('Actors', actorSchema);
const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);
const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

async function seedDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB successfully.');

        console.log('Clearing existing collections...');
        await Review.deleteMany({});
        await Movie.deleteMany({});
        await Actor.deleteMany({});
        await User.deleteMany({});
        console.log('Existing collections cleared.');

        console.log('Seeding Users...');
        const users = await User.create([
            {
                username: 'AhmedAli',
                email: 'ahmed.ali@example.com',
                password: 'Password123!',
                image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
            },
            {
                username: 'SaraHassan',
                email: 'sara.hassan@example.com',
                password: 'Password123!',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
            },
            {
                username: 'OmarKhaled',
                email: 'omar.khaled@example.com',
                password: 'Password123!',
                image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
            }
        ]);
        console.log(`Created ${users.length} users.`);

        console.log('Seeding Actors...');
        const actors = await Actor.create([
            {
                name: 'Leonardo DiCaprio',
                images: ['https://upload.wikimedia.org/wikipedia/commons/4/46/Leonardo_Dicaprio_Cannes_2019.jpg'],
                birthdate: new Date('1974-11-11'),
            },
            {
                name: 'Joseph Gordon-Levitt',
                images: ['https://upload.wikimedia.org/wikipedia/commons/7/7d/Joseph_Gordon-Levitt_2013.jpg'],
                birthdate: new Date('1981-02-17'),
            },
            {
                name: 'Christian Bale',
                images: ['https://upload.wikimedia.org/wikipedia/commons/0/0b/Christian_Bale-7837.jpg'],
                birthdate: new Date('1974-01-30'),
            },
            {
                name: 'Heath Ledger',
                images: ['https://upload.wikimedia.org/wikipedia/commons/e/ea/Heath_Ledger_%28Berlin_Film_Festival%29_crop.jpg'],
                birthdate: new Date('1979-04-04'),
            },
            {
                name: 'Matthew McConaughey',
                images: ['https://upload.wikimedia.org/wikipedia/commons/8/8e/Matthew_McConaughey_2019_%2848648345872%29.jpg'],
                birthdate: new Date('1969-11-04'),
            },
            {
                name: 'Anne Hathaway',
                images: ['https://upload.wikimedia.org/wikipedia/commons/b/b3/Anne_Hathaway_at_2019_Berlinale.jpg'],
                birthdate: new Date('1982-11-12'),
            }
        ]);
        console.log(`Created ${actors.length} actors.`);

        console.log('Seeding Movies...');
        const movies = await Movie.create([
            {
                title: 'Inception',
                year: 2010,
                genres: ['Action', 'Sci-Fi', 'Thriller'],
                description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
                trailerLink: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
                image: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
                director: 'Christopher Nolan',
                actors: [actors[0]._id, actors[1]._id],
            },
            {
                title: 'The Dark Knight',
                year: 2008,
                genres: ['Action', 'Crime', 'Drama'],
                description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
                trailerLink: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
                image: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
                director: 'Christopher Nolan',
                actors: [actors[2]._id, actors[3]._id],
            },
            {
                title: 'Interstellar',
                year: 2014,
                genres: ['Adventure', 'Drama', 'Sci-Fi'],
                description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
                trailerLink: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
                image: 'https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_.jpg',
                director: 'Christopher Nolan',
                actors: [actors[4]._id, actors[5]._id],
            }
        ]);
        console.log(`Created ${movies.length} movies.`);

        console.log('Seeding Reviews...');
        const reviews = await Review.create([
            {
                number: 10,
                comment: 'A visual and psychological masterpiece! Christopher Nolan at his finest.',
                movie: movies[0]._id,
                user: users[0]._id,
            },
            {
                number: 9,
                comment: 'Mind-bending concept and Hans Zimmer score is unbelievable.',
                movie: movies[0]._id,
                user: users[1]._id,
            },
            {
                number: 10,
                comment: 'Heath Ledger as the Joker is one of the best acting performances in cinema history.',
                movie: movies[1]._id,
                user: users[0]._id,
            },
            {
                number: 10,
                comment: 'An emotional and scientific journey. Cried at the end!',
                movie: movies[2]._id,
                user: users[2]._id,
            }
        ]);
        console.log(`Created ${reviews.length} reviews.`);

        console.log('\nSeeding completed successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
    }
}

seedDatabase();
