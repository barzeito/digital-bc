import { useEffect, useState } from "react";
import "./Home.css";
import CardModel from "../../models/cardModel";
import cardsService from "../../services/cardsService";
import notify from "../../services/Notify";
import { CardsStore } from "../../redux/cardState";
import Cards from "../cards/adminDashboard/Cards";

function Footer(): JSX.Element {
    const [cards, setCards] = useState<CardModel[]>([]);

    useEffect(() => {
        cardsService.getAll()
            .then(cardsFromServer => setCards(cardsFromServer))
            .catch(error => notify.error(error));

        const unsubscribe = CardsStore.subscribe(() => {
            setCards([...CardsStore.getState().card])
        })
        return unsubscribe;
    }, []);

    return (
        <div className="Home">
            {cards.map(c => <Cards key={c.id} card={c} />)}
        </div>
    );
}

export default Footer;
