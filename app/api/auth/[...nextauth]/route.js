import {connectMongoDb, disconnectMongoDb} from '@/lib/mongodb';
import User from "@/models/user";
import GoogleUser from '@/models/userGoogleAuth';
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import GoogleProvider from "next-auth/providers/google";



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
        }),
        GoogleProvider({
            clientId:process.env.GOOGLE_CLIENT_ID,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET
        }),
        ],
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
              async signIn({profile, account}){
                //console.log('profile', profile, account);
                if(account.provider === 'google'){
                   await connectMongoDb();
                   const userExits = await GoogleUser.findOne({email:profile.email}).select("_id")
                   if(!userExits){
                        const user = await GoogleUser.create({
                            email:profile.email,
                            name:profile.name,
                            image:profile.picture
                        })
                   }
                   await disconnectMongoDb();
                }
                return true
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
        },
        
}
const handler = NextAuth(authOptions)

export {handler as GET, handler as POST};