import { useEffect, useState } from "react";
import CardModel from "../../../models/cardModel";
import "./CardDisplay.css";
import cardsService from "../../../services/cardsService";
import notify from "../../../services/Notify";
import { useNavigate, useParams } from "react-router-dom";


function CardDisplay(): JSX.Element {

    const { company } = useParams();
    const navigate = useNavigate();
    const [card, setCard] = useState<CardModel>();

    useEffect(() => {
        if (company) {
            cardsService.getByName(company)
                .then(cardFromServer => {
                    if (cardFromServer) {
                        setCard(cardFromServer)
                    } else {
                        navigate("/")
                    }
                })
                .catch(error => notify.error(error))
        }
    }, [company])

    return (
        <div className="CardDisplay">
            <div className="cardDisplay-header">
                <div className="header-info">
                    <h2 className="company-name">{card?.company}</h2>
                    <p className="description">{card?.description}</p>
                </div>
            </div>
            <div className="cardDisplay-body">
                <div className="cardDisplay-info">
                    <p><strong>Email:</strong> {card?.email}</p>
                    <p><strong>Phone:</strong> {card?.phone}</p>
                    <p><strong>Website:</strong> <a href={card?.website} target="_blank" rel="noopener noreferrer">{card?.website}</a></p>
                    <p><strong>Address:</strong> {card?.address}</p>
                </div>
            </div>
        </div>
    );
}

export default CardDisplay;
