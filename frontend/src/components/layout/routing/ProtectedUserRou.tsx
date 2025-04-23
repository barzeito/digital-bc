import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { authStore } from "../../../redux/authState";
import { jwtDecode } from "jwt-decode";

function UserRoute({ element }: { element: JSX.Element }) {
    const [isOwner, setIsOwner] = useState<boolean | null>(null);
    const params = useParams();
    const routeUserId = params.userId || params.id;

    useEffect(() => {
        const token = authStore.getState().token;

        if (token) {
            try {
                const decoded = jwtDecode<{ user: { userId: string } }>(token);
                const currentUserId = decoded.user.userId;
                setIsOwner(currentUserId === routeUserId);
            } catch (err) {
                setIsOwner(false);
            }
        } else {
            setIsOwner(false);
        }

        const unsubscribe = authStore.subscribe(() => {
            const updatedToken = authStore.getState().token;
            if (updatedToken) {
                try {
                    const decoded = jwtDecode<{ user: { userId: string } }>(updatedToken);
                    const currentUserId = decoded.user.userId;
                    setIsOwner(currentUserId === routeUserId);
                } catch (err) {
                    setIsOwner(false);
                }
            } else {
                setIsOwner(false);
            }
        });

        return unsubscribe;
    }, [routeUserId]);

    if (isOwner === null) return <></>;

    return isOwner ? element : <Navigate to="/" />;
}

export default UserRoute;