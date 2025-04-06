import { useEffect, useState } from "react";
import "./CardList.css";
import CardModel from "../../../models/cardModel";
import cardsService from "../../../services/cardsService";
import notify from "../../../services/Notify";
import { CardsStore } from "../../../redux/cardState";
import Cards from "../cards/Cards";
import { useNavigate } from "react-router-dom";

function CardList(): JSX.Element {

    const [cards, setCards] = useState<CardModel[]>([]);
    const navigate = useNavigate();

    useEffect(() => {

        if (!localStorage.getItem('dbcToken' || undefined || null)) {
            navigate('/');
        }
        cardsService.getAll()
            .then(cardsFromServer => setCards(cardsFromServer))
            .catch(error => notify.error(error));

        const unsubscribe = CardsStore.subscribe(() => {
            setCards([...CardsStore.getState().card])
        })
        return unsubscribe;
    }, [navigate]);

    return (
        <div className="CardList">
            {cards.map(c => <Cards key={c.id} card={c} />)}
        </div>
    );
}

export default CardList;
