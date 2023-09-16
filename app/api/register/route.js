import User from "@/models/user";
import {NextResponse} from "next/server";
import {connectMongoDb, disconnectMongoDb} from '@/lib/mongodb';
import bcrypt from 'bcryptjs'

export const POST = async (req)=>{
    try {
        const {email, password, address, name} = await req.json();
        const hasPassword = await bcrypt.hash(password, 10);
        await connectMongoDb();
        await User.create({
            email, password:hasPassword, address, name
        })
        return NextResponse.json({
            message:"User Create Successfully"
        },{
            status:201
        })
    } catch (error) {
        return NextResponse.json({
            message:"user create error"
        },{
            status:500
        })
    } finally{
        await disconnectMongoDb();
    }
}
