import mongoose from 'mongoose'

const favoriteSongSchema = new mongoose.Schema(
    {
        userId: String,
        songId: String,
        deleted: {
            type: Boolean,
            default: false
        },
        deleteAt: Date
    }, 
    { timestamps: true}
)

const favoriteSong = mongoose.model('favoriteSong', favoriteSongSchema, 'favorite-song')

export default favoriteSong