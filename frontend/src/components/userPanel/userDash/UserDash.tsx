import "./UserDash.css";
import { useEffect, useState } from "react";
import UserMenu from "../userMenu/UserMenu";
import CardModel from "../../../models/cardModel";
import cardsService from "../../../services/cardsService";
import notify from "../../../services/popupMessage"
import { CardsStore } from "../../../redux/cardState";
import UserCards from "../userCards/UserCards";
import { useCurrentUser } from "../../../utils/useCurrentUser";
import SideBarMenu from "../../menu/sideBarMenu/SideBarMenu";
import DashboardLayout from "../../adminPanel/dashboardLayout/DashboardLayout";

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
            <DashboardLayout>
                <div>
                    <h2>הכרטיסים שלי</h2>
                    <p>ניהול הכרטיסים שברשותך</p>
                </div>
                <div className="DisplayCards">
                    {userCards.length === 0 && (
                        <div className="NoCardsMessage">
                            <p>לא נמצאו כרטיסים המשויכים למשתמש שלך.</p>
                            <p>במידה ומדובר בטעות, אנא צור קשר עם צוות התמיכה.</p>
                        </div>
                    )}
                    <table className="cards-table">
                        <thead>
                            <tr>
                                <th>שם חברה</th>
                                <th>נוצר בתאריך</th>
                                <th>עדכון אחרון</th>
                                <th>אימייל</th>
                                <th>טלפון</th>
                                <th>פעולות</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userCards.map(uc => <UserCards key={uc.id} card={uc} />)}
                        </tbody>
                    </table>
                </div>
            </DashboardLayout>
        </div>
    );
}

export default UserDash;
