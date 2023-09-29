import {connectMongoDb, disconnectMongoDb} from '@/lib/mongodb';
import User from "@/models/user";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github"


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
                    console.log('user', user)
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
        GitHubProvider({
            clientId:process.env.GITHUB_CLIENT_ID,
            clientSecret:process.env.GITHUB_CLIENT_SECRET
        })
        ],
        callbacks:{
            async jwt({token, user, session, trigger}){
                 if(trigger === 'update'){
                    const newToken = { ...token };
                    newToken.name = session.user.name;
                    newToken.address = session.user.address; 
                     console.log('___sessionnewToken',newToken);
                    await connectMongoDb();
                    const newUserInfo = await User.updateOne({
                        where:{
                            _id:newToken.id
                        },
                        $set:{
                            name:newToken.name,
                            address:newToken.address
                        }
                    }) 
                    
                    await disconnectMongoDb();
                    console.log('upate',newUserInfo, newToken, '____')
                    return newToken
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
                console.log('profile', profile, account);
                if(account.provider === 'google'){
                   await connectMongoDb();
                   const userExits = await User.findOne({email:profile.email}).select("_id")
                   if(!userExits){
                        const user = await User.create({
                            email:profile.email,
                            name:profile.name,
                            image:profile.picture,
                            address:''
                        })
                   }
                   await disconnectMongoDb();
                }
                if(account.provider === 'github'){
                    await connectMongoDb();
                    const userExits = await User.findOne({email:profile.email}).select("_id")
                    if(!userExits){
                         const user = await User.create({
                             email:profile.email,
                             name:profile.name,
                             image:profile.avatar_url,
                             address:profile.location
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