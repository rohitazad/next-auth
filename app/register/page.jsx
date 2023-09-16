

import RegisterComponents from '@/components/Registration';
import { getServerSession } from 'next-auth';
import { redirect} from 'next/navigation';
import {authOption} from '../api/auth/[...nextauth]/route';


const RegisterPage =  async ()=>{
    const session = await getServerSession(authOption);
    if(session){
      redirect("/dashboard")
    }
  
    return (
        <>
            <RegisterComponents />
        </>
    )
}

export default RegisterPage;