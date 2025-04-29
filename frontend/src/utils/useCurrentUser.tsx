import { useEffect, useState } from "react";
import { authStore } from "../redux/authState";
import { jwtDecode } from "jwt-decode";

type User = {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    roleId: number;
};

export function useCurrentUser(): User | null {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const getUserFromToken = (token: string) => {
            try {
                return jwtDecode<{ user: User }>(token).user;
            } catch {
                return null;
            }
        };

        const token = authStore.getState().token;
        setUser(token ? getUserFromToken(token) : null);

        const unsubscribe = authStore.subscribe(() => {
            const updatedToken = authStore.getState().token;
            setUser(updatedToken ? getUserFromToken(updatedToken) : null);
        });

        return unsubscribe;
    }, []);

    return user;
}

export default useCurrentUser;
