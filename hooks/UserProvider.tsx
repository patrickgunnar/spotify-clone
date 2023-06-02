'use client'

import { MyUserContextProvider } from "./useUser";


interface UserProviderProps {
    children: React.ReactNode
}

// user provider
const UserProvider: React.FC<UserProviderProps> = ({
    children
}) => {

    // render context provider
    return (
        <MyUserContextProvider>
            {children}
        </MyUserContextProvider>
    );
}
 
export default UserProvider;
