import { useEffect, useState } from "react";
import "./UserCardList.css";
import { useNavigate } from "react-router-dom";
import cardsService from "../../../services/cardsService";
import notify from "../../../services/Notify";
import { CardsStore } from "../../../redux/cardState";
import CardModel from "../../../models/cardModel";
import UserCards from "../userCards/UserCards";

function UserCardList(): JSX.Element {

    const [cards, setCards] = useState<CardModel[]>([]);
    const navigate = useNavigate();

    // useEffect(() => {
    //     cardsService.getAll()
    //         .then(cardsFromServer => setCards(cardsFromServer))
    //         .catch(error => notify.error(error));

    //     const unsubscribe = CardsStore.subscribe(() => {
    //         setCards([...CardsStore.getState().cards])
    //     })
    //     return unsubscribe;
    // }, [navigate]);
    
    return (
        <div className="UserCardList">
            <div className="DisplayCards">
                {cards.map(c => <UserCards key={c.id} card={c} />)}
            </div>
        </div>
    );
}

export default UserCardList;
