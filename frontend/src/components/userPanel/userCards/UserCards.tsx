import { NavLink } from "react-router-dom";
import CardModel from "../../../models/cardModel";
import "./UserCards.css";
import formatDate from "../../../utils/formateDate";

interface userCardsProps {
    card: CardModel;
}

function UserCards(props: userCardsProps): JSX.Element {

    return (
        <div className="UserCards">
            <div className="uc-header">
                <div className="uc-header-info">
                    <h2 className="uc-company-name">{props.card.company}</h2>
                    <p className="uc-description">{props.card.description}</p>
                </div>
                <div className="uc-times">
                    <p><strong>נוצר בתאריך:</strong> {props.card.created_at && formatDate(props.card.created_at)}</p>
                    <p><strong>עדכון אחרון:</strong> {props.card.updated_at && formatDate(props.card.updated_at)}</p>
                </div>
            </div>

            <div className="uc-body">
                <div className="uc-info">
                    <p><strong>אימייל:</strong> {props.card.email}</p>
                    <p><strong>טלפון:</strong> {props.card.phone}</p>
                    <p><strong>אתר:</strong> <a href={props.card.website} target="_blank" rel="noopener noreferrer">{props.card.website}</a></p>
                    <p><strong>כתובת:</strong> {props.card.address}</p>
                </div>
            </div>

            <div className="uc-btn">
                <NavLink to={`/cards/${props.card.company}`} className="view-btn">צפייה</NavLink>
                <NavLink to={`/panel/user/edit-card/${props.card.ownedBy}/${props.card.id}`} className="edit-btn">עריכה</NavLink>
                <NavLink to={`/panel/user/appointments/edit/${props.card.ownedBy}/${props.card.id}`} className="edit-btn">תורים</NavLink>
            </div>
        </div>
    );
}

export default UserCards;
