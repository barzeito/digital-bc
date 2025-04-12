import { Navigate, useNavigate, useParams } from "react-router-dom";
import "./UserDash.css";
import { useEffect, useState } from "react";
import { authStore } from "../../../redux/authState";
import { jwtDecode } from "jwt-decode";
import UserMenu from "../userMenu/UserMenu";
import CardModel from "../../../models/cardModel";
import cardsService from "../../../services/cardsService";
import notify from "../../../services/Notify";
import { CardsStore } from "../../../redux/cardState";
import UserCards from "../userCards/UserCards";

function UserDash(): JSX.Element {

    const { id } = useParams<{ id: string }>();

    const [isOwner, setIsOwner] = useState<boolean | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [userCards, setUserCards] = useState<CardModel[]>([]);

    useEffect(() => {
        const token = authStore.getState().token;

        if (token) {
            const decoded = jwtDecode<{ user: { userId: string } }>(token);
            const currentUserId = decoded.user.userId;
            setUserId(currentUserId);
            setIsOwner(currentUserId === id);
        } else {
            setIsOwner(false);
        }

        const unsubscribe = authStore.subscribe(() => {
            const updatedToken = authStore.getState().token;
            if (updatedToken) {
                const updatedUserId = jwtDecode<{ user: { userId: string } }>(updatedToken).user.userId;
                setUserId(updatedUserId);
                setIsOwner(updatedUserId === id);
            } else {
                setUserId(null);
                setIsOwner(false);
            }
        });

        return unsubscribe;
    }, [id]);

    useEffect(() => {
        if (!userId) return;

        cardsService.getUserCards(userId)
            .then(cardsFromServer => setUserCards(cardsFromServer))
            .catch(error => notify.error(error));

        const unsubscribe = CardsStore.subscribe(() => {
            setUserCards([...CardsStore.getState().cards]);
        });

        return unsubscribe;
    }, [userId]);

    if (isOwner === null) return <></>;

    if (!isOwner) return <Navigate to="/*" />;

    return (
        <div className="UserDash">
            <UserMenu />
            <div className="DisplayCards">
                {userCards.length === 0 && (
                    <div className="NoCardsMessage">
                        <p>לא נמצאו כרטיסים המשויכים למשתמש שלך.</p>
                        <p>במידה ואתה סבור שמדובר בטעות, אנא צור קשר עם צוות התמיכה.</p>
                    </div>
                )}
                {userCards.map(uc => <UserCards key={uc.id} card={uc} />)}
            </div>
        </div>
    );
}

export default UserDash;
