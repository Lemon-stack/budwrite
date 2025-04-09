"use client"
import { createClient } from "@/utils/supabase/client";
import { User } from '@supabase/supabase-js';
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface ContextProps{
    user?: User | null
}
interface ProviderProps {
    children: ReactNode;
  }
const AuthContext = createContext<ContextProps | null>(null)

const AuthProvider = ({children}:ProviderProps)=>{
    const [user, setUser] = useState<User | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, []);
  
    const value:ContextProps = {
        user: user
    }
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);