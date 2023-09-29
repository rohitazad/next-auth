"use client"

import LoaderComponents from "@/components/Loader";
import Link from "next/link";
import {useState} from 'react';
import {signIn} from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import imageLink from '@/public/google-signin-button.png';
import GitHubImage from "@/public/signInWithGithub.png";

const LoginComponents = ()=>{
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [error, setError] = useState("")
    const [loader, setLoader] = useState(false);
    const router = useRouter();
    const loginSubmitForm = async ()=>{
        try {
            setLoader(true)
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });
            console.log('res', res)
            if (res && res.error) {
                setLoader(false)
                setError("Invalid Credentials");
                return;
            }else{
                router.replace("dashboard");
            }
            setLoader(false)
        } catch (error) {
            console.log(error);
            setLoader(false)
        }
    }
    const formSubmit = (e:any)=>{
        e.preventDefault();
        setError("")
        if(!email || !password){
            setError("pelse fill email and password ")
        }else{
            setError("")
            loginSubmitForm()
        }
    }
    return (
        <>
        {
            loader && <LoaderComponents />
        }
            <div className="max-w-xl mx-auto mt-7 bg-white rounded-lg">
                <div className="shadow-lg p-5 rounded-lg border-t-4 border-b-4 border-l-4 border-r-4 border-blue-500">
                    <h1 className="text-2xl mb-4 text-center">Login</h1>
                    <form className=" flex flex-col gap-3 bg-gray-200 p-4 rounded-lg shaddow-md" onSubmit={formSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="bloc font-semibold">
                                Email ID
                            </label>
                            <input type="email" className="w-full px-2 py-1 border rounded mt-2" id="email"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)} />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="bloc font-semibold">
                                Passwrod
                            </label>
                            <input type="password" className="w-full px-2 py-1 border rounded mt-2" id="password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)} />
                        </div>

                        <div className="">
                            <button className="bg-blue-500  text-white font-bold cursor-pointer px-6 py-4 w-full text-2xl" type="submit">Login</button>
                        </div>
                    </form>
                    {
                        error && <div className="bg-red-500 text-white text-sm py-1 roundexd-sm mt-2 text-center">
                            {error}
                        </div>
                    }
                    <div className=" text-center mt-3">
                        <Link href={`/register`}>
                            Do not have an account ? <span className="underline">Register</span>    
                        </Link>
                        
                    </div>
                    <div className="text-center font-bold text-2xl">
                        OR
                    </div>
                    <div className="text-center mt-2">
                        <Image
                            className="inline-block cursor-pointer"
                            onClick={()=>{signIn('google')}}
                            src={imageLink}
                            width={300} 
                            height={50}
                            alt="Googel"/>
                    </div>
                    <div className="text-center mt-2">
                        <Image
                            className="inline-block cursor-pointer"
                            onClick={()=>{signIn('github')}}
                            src={GitHubImage}
                            width={300} 
                            height={50}
                            alt="github"/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginComponents;