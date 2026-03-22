import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if(!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
    if(cached.conn) {
        return cached.conn;
    }
    if(!cached.promise) {
        mongoose
        .connect(MONGODB_URI,)
        .then(() => {mongoose.connection.on('connected', () => {
            console.log('MongoDB connected');
        }).on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
        const opts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
            return mongoose;
        });
    }   
    cached.conn = await cached.promise;
    return cached.conn;
} 