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
    password:{
        type:String
    },
    image:{
        type:String
    }
},
{
    timestamps:true
})

const User = models.User || mongoose.model("User", userSchema);

export default User;