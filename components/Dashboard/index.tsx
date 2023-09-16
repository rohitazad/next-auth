"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";


const DashBoardComponents = ()=>{
    const { data: session} = useSession();
    return (
        <>
            <div className="max-w-xl mx-auto mt-7 bg-white rounded-lg">
                <div className="shadow-lg p-5 rounded-lg border-t-4 border-b-4 border-l-4 border-r-4 border-blue-500">
                    <h1 className="text-2xl mb-4 text-center">DashBoard user Info</h1>
                    <div className="bg-blue-500 p-3 mt-4 text-white">
                        Name : <span>{session?.user?.name}</span>
                    </div>
                    <div className="bg-blue-500 p-3 mt-4 text-white">
                        Email : <span>{session?.user?.email}</span>
                    </div>
                    <div className="mt-5">
                        <button className="bg-red-500 text-white font-bold px-6 py-2 " onClick={()=>signOut()}>Sign Out</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashBoardComponents;