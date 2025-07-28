import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema({
    name: { type: String },
    phoneNumber: { type: String, unique: true },
    email: { type: String, unique: true },
    ranking: { type: String },
    positionRanking: { type: Number },
    urlPhotoPlayer: { type: String },
}, {
    timestamps: true, 
    collection: 'players',
})