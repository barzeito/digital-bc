import { useEffect, useState } from "react";
import AdminMenu from "../AdminMenu/AdminMenu";
import "./AdminDash.css";
import CardModel from "../../../models/cardModel";
import cardsService from "../../../services/cardsService";
import notify from "../../../services/popupMessage";
import { CardsStore } from "../../../redux/cardState";
import userModel from "../../../models/userModel";
import authService from "../../../services/authService";
import { authStore } from "../../../redux/authState";

function AdminPanel(): JSX.Element {

    const [cards, setCards] = useState<CardModel[]>([]);
    const [users, setUsers] = useState<userModel[]>([]);

    useEffect(() => {
        cardsService.getAll()
            .then(cardsFromServer => setCards(cardsFromServer))
            .catch(error => notify.error(error));

        const unsubscribe = CardsStore.subscribe(() => {
            setCards([...CardsStore.getState().cards])
        })
        return unsubscribe;
    },);


    useEffect(() => {
        authService.getAllUsers()
            .then(usersFromServer => setUsers(usersFromServer))
            .catch(error => notify.error(error));

        const unsubscribe = authStore.subscribe(() => {
            setUsers([...authStore.getState().userData])
        })
        return unsubscribe;
    }, []);

    return (
        <div className="AdminDash">
            <AdminMenu />

            <div className="dashboard-content">
                <section className="welcome">
                    <h1>שלום אדמין!</h1>
                    <p>הנה מה שקורה במערכת שלך כרגע:</p>
                </section>

                <section className="system-status">
                    <div className="status-card">
                        <h3>משתמשים רשומים</h3>
                        <p>{users.length} משתמשים פעילים</p>
                    </div>
                    <div className="status-card">
                        <h3>כרטיסים פעילים</h3>
                        <p>{cards.length} כרטיסים פעילים</p>
                    </div>
                    <div className="status-card">
                        <h3>פניות אחרונות</h3>
                        <p>3 פניות חדשות</p>
                    </div>
                </section>

                <section className="quick-links">
                    <h2>מה אפשר לעשות?</h2>
                    <div className="link-card">
                        <button>ניהול משתמשים</button>
                    </div>
                    <div className="link-card">
                        <button>ניהול כרטיסים</button>
                    </div>
                    <div className="link-card">
                        <button>שליחת הודעה כללית</button>
                    </div>
                </section>

                <section className="system-info">
                    <h2>סטטוס מערכת</h2>
                    <p>✅ הכל תקין. אין בעיות כרגע.</p>
                    <p>🛠️ בקרוב: לוח ניתוחים וסטטיסטיקות שימוש.</p>
                </section>
            </div>
        </div>
    );
}

export default AdminPanel;
