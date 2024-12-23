import mongoose, { Schema } from "mongoose";

const vehicleSchema = new Schema({

    number:{type:String,required: true},
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    societyId: { type: Schema.Types.ObjectId, ref: 'Society', required: true },
    type:{type:String},
    name:{type:String},
})

export default mongoose.models?.Vehicle || mongoose.model('Vehicle', vehicleSchema);