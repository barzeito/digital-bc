import CardModel from "../../../models/cardModel";
import formatDate from "../../../utils/formateDate";
import "./Cards.css";

interface cardsProps {
    card: CardModel;
}

function Cards(props: cardsProps): JSX.Element {

    return (
        <div className="Cards">
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
                <button className="view-btn">View</button>
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
            </div>
        </div>
    );
}

export default Cards;
