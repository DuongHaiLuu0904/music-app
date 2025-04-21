import mongoose from 'mongoose';

const settingGeneralSchema = new mongoose.Schema({
    webSiteName: String,
    logo: String,
    phone: String,
    email: String,
    address: String,
    copyRight: String,
}, {
    timestamps: true
});

const settingGeneral = mongoose.model('settingGeneral', settingGeneralSchema, 'setting-general');
export default settingGeneral;