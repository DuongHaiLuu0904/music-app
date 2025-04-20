import mongoose from 'mongoose';
import slug from 'mongoose-slug-updater'

mongoose.plugin(slug)

const roleSchema = new mongoose.Schema({
    title: String,
    description: String,
    permissions: {
        type: Array,
        default: []
    },
    slug: {
        type: String, 
        slug: "title", 
        unique: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deleteAt: Date
}, {
    timestamps: true
});

const Role = mongoose.model('Role', roleSchema, 'roles');
export default Role;