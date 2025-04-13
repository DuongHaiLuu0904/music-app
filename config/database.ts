import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

export const connect = async (): Promise<void> => {
    try {
        const mongoUrl = process.env.MONGO_URL
        
        if (!mongoUrl) {
            throw new Error('MONGO_URL is not defined in environment variables')
        }
        
        await mongoose.connect(mongoUrl)
        console.log('MongoDB connected')
    } catch (error) {
        console.error('MongoDB connection error:', error)
    }
}