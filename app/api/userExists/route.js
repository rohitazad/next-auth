import User from "@/models/user";
import {NextResponse} from "next/server";
import {connectMongoDb, disconnectMongoDb} from '@/lib/mongodb';


export const POST = async (req)=>{
    try {
        const {email} = await req.json();
        await connectMongoDb();
        const user = await User.findOne({email}).select("_id")
        console.log('user', user);
        return NextResponse.json({
            user
        },
        {
            status:200
        })
    } catch (error) {
        NextResponse.json({
            message:"not found user"
        },
        {
            status:500
        })
    }finally{
        await disconnectMongoDb();
    }
}
