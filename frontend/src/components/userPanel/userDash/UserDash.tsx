import { Navigate, useParams } from "react-router-dom";
import "./UserDash.css";
import { useEffect, useState } from "react";
import { authStore } from "../../../redux/authState";
import { jwtDecode } from "jwt-decode";
import UserMenu from "../userMenu/UserMenu";
import CardModel from "../../../models/cardModel";
import cardsService from "../../../services/cardsService";
import notify from "../../../services/popupMessage"
import { CardsStore } from "../../../redux/cardState";
import UserCards from "../userCards/UserCards";
import { useCurrentUser } from "../../../utils/useCurrentUser";

function UserDash(): JSX.Element {

    const user = useCurrentUser();
    const userId = user?.userId;
    const [userCards, setUserCards] = useState<CardModel[]>([]);

    useEffect(() => {
        if (!userId) return;

        cardsService.getUserCards(userId)
            .then(cardsFromServer => {
                setUserCards(cardsFromServer);
            })
            .catch(error => notify.error(error));

        const unsubscribe = CardsStore.subscribe(() => {
            setUserCards([...CardsStore.getState().cards]);
        });

        return unsubscribe;
    }, [userId]);

    return (
        <div className="UserDash">
            <UserMenu />
            <div className="DisplayCards">
                {userCards.length === 0 && (
                    <div className="NoCardsMessage">
                        <p>לא נמצאו כרטיסים המשויכים למשתמש שלך.</p>
                        <p>במידה ומדובר בטעות, אנא צור קשר עם צוות התמיכה.</p>
                    </div>
                )}
                {userCards.map(uc => <UserCards key={uc.id} card={uc} />)}
            </div>
        </div>
    );
}

export default UserDash;
