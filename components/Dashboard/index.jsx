"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

const DashBoardComponents = ()=>{
    const { data: session, update} = useSession();
    const [editInfo, setEdiInfo] = useState(false);
    const [name, setName]= useState("");
    const [address, setAddress] = useState("");
    const infoUpdate = async (e)=>{
        e.preventDefault();
        setEdiInfo(!editInfo);
        
        if(editInfo){
            console.log('session',session, name,address)
            await update({
                ...session,
                user:{
                    ...session.user,
                    name:name,
                    address:address
                }
            })
        }
    }
    useEffect(()=>{
        setName(session?.user?.name)
        setAddress(session?.user?.address)
    }, [session])
    return (
        <>
            <div className="max-w-xl mx-auto mt-7 bg-white rounded-lg">
                <div className="shadow-lg p-5 rounded-lg border-t-4 border-b-4 border-l-4 border-r-4 border-blue-500">
                    <h1 className="text-2xl mb-4 text-center">DashBoard user Info</h1>
                    <div className="bg-blue-500 p-3 mt-4 text-white">
                        Name : 
                        {
                            !editInfo ? <span>{session?.user?.name}</span> : <input type="text" value={name}
                            onChange={(e)=>setName(e.target.value)} className="text-black ml-5 px-2 py-1 border-rounded mt-2" />
                        }
                    </div>
                    <div className="bg-blue-500 p-3 mt-4 text-white">
                        Email : <span>{session?.user?.email}</span>
                    </div>
                    <div className="bg-blue-500 p-3 mt-4 text-white">
                        Address : 
                        {
                            !editInfo ? <span>{session?.user?.address}</span> : <input type="text" value={address}
                            onChange={(e)=>setAddress(e.target.value)} className="text-black ml-5 px-2 py-1 border-rounded mt-2" />
                        }
                    </div>
                    <div className="mt-5">
                        <button className="bg-red-500 text-white font-bold px-6 py-2 " onClick={()=>signOut()}>Sign Out</button>

                        {
                            !editInfo ? <button className="bg-blue-500 ml-2 text-white font-bold px-6 py-2 " onClick={infoUpdate}>Edit Info</button> : <button className="bg-blue-500 ml-2 text-white font-bold px-6 py-2 " onClick={infoUpdate}>Update Info</button>
                        }

                    </div>
                </div>
            </div>
        </>
    )
}

export default DashBoardComponents;