import { useState } from "react";
import "./Cards.css";
import cardsService from "../../../services/cardsService";
import notify from "../../../services/Notify";
import CardModel from "../../../models/cardModel";
import formatDate from "../../../utils/formateDate";
import { NavLink } from "react-router-dom";
import AdminMenu from "../AdminMenu/AdminMenu";

interface cardsProps {
    card: CardModel;
}
function Cards(props: cardsProps): JSX.Element {

    const cardId = props.card.id;
    const [showDelete, setShowDelete] = useState(false);

    async function deleteCard(): Promise<void> {
        try {
            if (cardId) {
                await cardsService.deleteCard(cardId);
                notify.success('Card deleted successfully');
            }
        } catch (error) {
            notify.error(error);
        }
        setShowDelete(false);
    }

    return (
        <div className="Cards">
            <AdminMenu />
            <div className="card-header">
                <div className="header-info">
                    <h2 className="company-name">{props.card.company}</h2>
                    <p className="description">{props.card.description}</p>
                </div>
                <div className="times">
                    <p><strong>Created:</strong> {props.card.created_at && formatDate(props.card.created_at)}</p>
                    <p><strong>Updated:</strong> {props.card.updated_at && formatDate(props.card.updated_at)}</p>
                </div>
            </div>

            <div className="card-body">
                <div className="card-info">
                    <p><strong>Email:</strong> {props.card.email}</p>
                    <p><strong>Phone:</strong> {props.card.phone}</p>
                    <p><strong>Website:</strong> <a href={props.card.website} target="_blank" rel="noopener noreferrer">{props.card.website}</a></p>
                    <p><strong>Address:</strong> {props.card.address}</p>
                </div>
            </div>

            <div className="card-footer">
                <NavLink to={`/cards/${props.card.company}`} className="view-btn">View</NavLink>
                <button className="edit-btn">Edit</button>
                <button className="delete-btn" onClick={() => setShowDelete(true)}>Delete</button>
            </div>
            {showDelete && (
                <div className="DeleteContainer">
                    <div className="Delete-PopUp">
                        <span>Delete Card</span>
                        <p>Are you sure you want to delete this card?</p>
                        <div className="confirm-btn">
                            <button onClick={deleteCard}>Delete</button>
                            <button onClick={() => setShowDelete(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cards;
