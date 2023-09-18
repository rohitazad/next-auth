import {connectMongoDb, disconnectMongoDb} from '@/lib/mongodb';
import User from "@/models/user";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getTokenSourceMapRange } from "typescript";


export const authOptions = {
    providers: [
        CredentialsProvider(
        {
            name:"credentials",
            credentials:{},

            async authorize(credentials){
                const {email, password} = credentials;

                try {
                    await connectMongoDb();
                    const user = await User.findOne({email});
                    if(!user){
                        return null;
                    }

                    const passwordMatch = await bcrypt.compare(password, user.password)

                    if(!passwordMatch){
                        return null;
                    }
                    //console.log('user', user)
                    return user;

                } catch (error) {
                    console.log('error', error)
                } finally{
                    await disconnectMongoDb();
                }

            }
        })],
        callbacks:{
              async jwt({token, user, session, trigger}){

                if(trigger === 'update'){
                    
                    token.name = session.user.name // updarte tokcen 
                    token.address = session.user.address // update 
                    await connectMongoDb();
                    const newUserInfo = await User.updateOne({
                        where:{
                            _id:token.id
                        },
                        $set:{
                            name:token.name,
                            address:token.address
                        }
                    }) 
                    
                    await disconnectMongoDb();
                    console.log('upate',newUserInfo, token, '____')
                    return token
                }

                if(user){
                  return{
                    ...token,
                    id:user.id,
                    address:user.address
                  }
                }
                return token;
              },
              async session({token, user, session}){
                return {
                  ...session,
                  user:{
                    ...session.user,
                    id:token.id,
                    address:token.address, // update session adress
                    name:token.name // update sessin info
                  }
                }
              }
            },
        session:{
            strategy:"jwt",
        },
        secret: process.env.NEXTAUTH_SECRET,
        pages:{
            signIn: "/"
        }
}
const handler = NextAuth(authOptions)

export {handler as GET, handler as POST};