import { useEffect, useState } from "react";
import "./CardList.css";
import CardModel from "../../../models/cardModel";
import cardsService from "../../../services/cardsService";
import notify from "../../../services/Notify";
import { CardsStore } from "../../../redux/cardState";
import Cards from "../cards/Cards";
import { NavLink, useNavigate } from "react-router-dom";
import AdminMenu from "../AdminMenu/AdminMenu";

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
            <AdminMenu />
            <div className="cards-options">
                <NavLink to="/panel/admin/cards/add-card" className="NewCard">
                    <div className="NavIcon"><i className="fa-solid fa-plus"></i></div>
                    <div className="NavText">יצירת כרטיס</div>
                </NavLink>
            </div>
            <div className="DisplayCards">
                {cards.map(c => <Cards key={c.id} card={c} />)}
            </div>
        </div>
    );
}

export default CardList;
