import { useEffect, useState } from "react";
import "./CardList.css";
import CardModel from "../../../models/cardModel";
import cardsService from "../../../services/cardsService";
import notify from "../../../services/popupMessage"
import { CardsStore } from "../../../redux/cardState";
import Cards from "../cards/Cards";
import { NavLink, useNavigate } from "react-router-dom";
import DashboardLayout from "../dashboardLayout/DashboardLayout";

function CardList(): JSX.Element {

    const [cards, setCards] = useState<CardModel[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        cardsService.getAll()
            .then(cardsFromServer => setCards(cardsFromServer))
            .catch(error => notify.error(error));

        const unsubscribe = CardsStore.subscribe(() => {
            setCards([...CardsStore.getState().cards])
        })
        return unsubscribe;
    }, [navigate]);

    return (
        <div className="CardList">
            <DashboardLayout>
                <div>
                    <h2>ניהול כרטיסים</h2>
                    <p>ניהול כרטיסים ושיוכים</p>
                </div>
                <div className="cards-options">
                    <NavLink to="/panel/admin/cards/add-card" className="newCard-btn">
                        <div className="NavIcon"><i className="fa-solid fa-plus"></i></div>
                        <div className="NavText">יצירת כרטיס חדש</div>
                    </NavLink>
                </div>
                <div className="DisplayCards">
                    <table className="cards-table">
                        <thead>
                            <tr>
                                <th>שם חברה</th>
                                <th>נוצר בתאריך</th>
                                <th>עדכון אחרון</th>
                                <th>אימייל</th>
                                <th>טלפון</th>
                                <th>בעלים</th>
                                <th>פעולות</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cards.map(c => <Cards key={c.id} card={c} />)}
                        </tbody>
                    </table>
                </div>
            </DashboardLayout>
        </div>
    );
}

export default CardList;
