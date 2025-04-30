import { NavLink } from "react-router-dom";
import CardModel from "../../../models/cardModel";
import "./UserCards.css";
import formatDate, { cardFormatDate } from "../../../utils/formateDate";

interface userCardsProps {
    card: CardModel;
}

function UserCards(props: userCardsProps): JSX.Element {

    return (
        <>
            <tr>
                <td>{props.card.company}</td>
                <td>{props.card.created_at && cardFormatDate(props.card.created_at)}</td>
                <td>{props.card.updated_at && cardFormatDate(props.card.updated_at)}</td>
                <td>{props.card.email}</td>
                <td>{props.card.phone}</td>
                <td className="cardActions">
                    <NavLink to={`/cards/${props.card.company}`} className="action-btn view-btn">צפייה</NavLink>
                    <NavLink to={`/panel/user/edit-card/${props.card.ownedBy}/${props.card.id}`} key={props.card.id} className="action-btn edit-btn">עריכה</NavLink>
                    <NavLink to={`/panel/user/appointments/edit/${props.card.ownedBy}/${props.card.id}`} className="action-btn app-btn">תורים</NavLink>
                </td>
            </tr>
        </>
    );
}

export default UserCards;
