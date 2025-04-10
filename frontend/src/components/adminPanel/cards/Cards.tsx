import { useState } from "react";
import "./Cards.css";
import cardsService from "../../../services/cardsService";
import notify from "../../../services/Notify";
import CardModel from "../../../models/cardModel";
import formatDate from "../../../utils/formateDate";
import { NavLink } from "react-router-dom";

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
            <div className="card-header">
                <div className="header-info">
                    <h2 className="company-name">{props.card.company}</h2>
                    <p className="description">{props.card.description}</p>
                </div>
                <div className="times">
                    <p><strong>נוצר בתאריך:</strong> {props.card.created_at && formatDate(props.card.created_at)}</p>
                    <p><strong>עדכון אחרון:</strong> {props.card.updated_at && formatDate(props.card.updated_at)}</p>
                </div>
            </div>

            <div className="card-body">
                <div className="card-info">
                    <p><strong>אימייל:</strong> {props.card.email}</p>
                    <p><strong>טלפון:</strong> {props.card.phone}</p>
                    <p><strong>אתר:</strong> <a href={props.card.website} target="_blank" rel="noopener noreferrer">{props.card.website}</a></p>
                    <p><strong>כתובת:</strong> {props.card.address}</p>
                    <p><strong>בעלים: </strong>
                        {props.card.firstName
                            ? `${props.card.firstName} ${props.card.lastName}`
                            : "לא משויך"}
                    </p>
                </div>
            </div>

            <div className="card-footer">
                <NavLink to={`/cards/${props.card.company}`} className="view-btn">צפייה</NavLink>
                <NavLink to={`/panel/admin/edit/${props.card.id}`} className="edit-btn">עריכה</NavLink>
                <button className="delete-btn" onClick={() => setShowDelete(true)}>מחיקה</button>
            </div>
            {showDelete && (
                <div className="DeleteContainer">
                    <div className="Delete-PopUp">
                        <span>מוחק את {props.card.company}</span>
                        <p>האם אתה בטוח שברצונך למחוק את {props.card.company}?</p>
                        <div className="confirm-btn">
                            <button onClick={deleteCard}>מחיקה</button>
                            <button onClick={() => setShowDelete(false)}>ביטול</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cards;
