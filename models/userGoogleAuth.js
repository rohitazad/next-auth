import mongoose, {Schema, models} from 'mongoose';

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    address:{
        type:String
    },
    email:{
        type:String,
        required:true
    },
    image:{
        type:String
    }
},
{
    timestamps:true
})

const GoogleUser = models.GoogleUser || mongoose.model("GoogleUser", userSchema);

export default GoogleUser;