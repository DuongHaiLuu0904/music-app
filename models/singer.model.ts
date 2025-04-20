import mongoose from 'mongoose'
import slug from 'mongoose-slug-updater'

mongoose.plugin(slug)

const singerSchema = new mongoose.Schema(
    {
        fullName: String,
        description: String,
        avatar: String,
        status: String,
        position: Number,
        slug: {
            type: String,
            slug: 'title',
            unique: true
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deleteAt: Date
    }, 
    { timestamps: true}
)

const Singer = mongoose.model('Singer', singerSchema, 'singers')

export default Singer