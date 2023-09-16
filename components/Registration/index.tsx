"use client"


import Link from "next/link";
import {useState} from 'react';
import LoaderComponents from "@/components/Loader";
import { useRouter } from "next/navigation";

const RegisterComponents = ()=>{
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("")
    const [loader, setLoader] = useState(false);
    const router = useRouter();

    const userCreateAPI = async ()=>{
        try {
            setLoader(true)
            const res = await fetch(`api/register`, {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    email,name,address, password
                })
            })
            if(res.ok){
                setLoader(false)
                alert("user created successfully !!")
                router.push("/")
            }else{
                setLoader(false)
                alert("user not create check api ")
            }
        } catch (error) {
            setLoader(false)
            console.log('error', error)
        }
    }

    const userExits = async ()=>{
        try {
            setError("")
            setLoader(true)
            const res = await fetch(`api/userExists`, {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    email
                })
            })
            const {user} = await res.json();
            if(user){
                setLoader(false)
                setError("user Allready exits please used anohter email id") 
            }else{
                userCreateAPI() 
            }
            
        } catch (error) {
            setLoader(false)
            console.log('error', error)
        }
    }
    const formSubmit = (e:any)=>{
        e.preventDefault();
        console.log('name', name)
        console.log('email', email);
        userExits();
        
    }

    return (
        <>
        {
            loader && <LoaderComponents />
        }
            <div className="max-w-xl mx-auto mt-7 bg-white rounded-lg">
                <div className="shadow-lg p-5 rounded-lg border-t-4 border-b-4 border-l-4 border-r-4 border-blue-500">
                    <h1 className="text-2xl mb-4 text-center">Registraion Form</h1>
                    <form className=" flex flex-col gap-3 bg-gray-200 p-4 rounded-lg shaddow-md" onSubmit={formSubmit}>
                    <div className="mb-4">
                            <label htmlFor="name" className="bloc font-semibold">
                                User Name
                            </label>
                            <input type="text" className="w-full px-2 py-1 border rounded mt-2" id="name" value={name}
                            onChange={(e)=>setName(e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="bloc font-semibold">
                                Email ID
                            </label>
                            <input type="email" className="w-full px-2 py-1 border rounded mt-2" id="email"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)} />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="address" className="bloc font-semibold">
                                Address
                            </label>
                            <input type="text" className="w-full px-2 py-1 border rounded mt-2" id="address"
                            value={address}
                            onChange={(e)=>setAddress(e.target.value)} />
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
                            <button className="bg-blue-500  text-white font-bold cursor-pointer px-6 py-4 w-full text-2xl"
                            type="submit">Register</button>
                        </div>
                    </form>
                    {
                        error && <div className="bg-red-500 text-white text-sm py-1 roundexd-sm mt-2 text-center">
                            {error}
                        </div>
                    }
                    <div className=" text-center mt-3">
                        <Link href={`/`}>
                            Already have an account ? <span className="underline">Login</span>    
                        </Link>
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default RegisterComponents;