import mongoose from 'mongoose';

export const connectMongoDb = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('mongoose connected successfully')
    } catch (error) {
        console.log('mongoose failed not connected ')
    }
}

export const disconnectMongoDb = async ()=>{
    try {
        await mongoose.disconnect();
        console.log('Mongoose Disconnected successfully')
    } catch (error) {
            console.log('error disconnected mogoose')
            throw error;
    }
}