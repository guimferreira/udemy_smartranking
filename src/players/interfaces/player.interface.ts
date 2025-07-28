import { Document } from "mongoose";

export interface Player extends Document{
    name: string;
    readonly phoneNumber: string;
    readonly email: string;
    ranking: string;
    positionRanking: number;
    urlPhotoPlayer: string; 
}