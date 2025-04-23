import { useState } from "react";
import "./Cards.css";
import cardsService from "../../../services/cardsService";
import notify from "../../../services/popupMessage"
import CardModel from "../../../models/cardModel";
import formatDate from "../../../utils/formateDate";
import { NavLink } from "react-router-dom";
import userModel from "../../../models/userModel";
import authService from "../../../services/authService";

interface cardsProps {
    card: CardModel;
}
function Cards(props: cardsProps): JSX.Element {

    const cardId = props.card.id;
    const [showDelete, setShowDelete] = useState(false);
    const [showAssignPopup, setShowAssignPopup] = useState(false);
    const [users, setUsers] = useState<userModel[]>([]);

    async function deleteCard(): Promise<void> {
        try {
            if (cardId) {
                await cardsService.deleteCard(cardId);
                notify.success('!הכרטיס נמחק בהצלחה');
            }
        } catch (error) {
            notify.error('.אירעה שגיאה בעת מחיקת הכרטיס, אנא נסה שוב');
        }
        setShowDelete(false);
    }

    async function fetchUsers() {
        try {
            const allUsers = await authService.getAllUsers();
            setUsers(allUsers);
            setShowAssignPopup(true);
        } catch (error) {
            notify.error("לא ניתן לטעון משתמשים");
        }
    }

    async function assignOwner(userId?: string) {
        if (!userId) {
            notify.error("User ID לא נמצא");
            return;
        }

        if (!cardId) {
            notify.error("Card ID לא נמצא");
            return;
        }

        try {
            await cardsService.assignUserToCard(cardId, userId);
            notify.success("!הכרטיס שויך בהצלחה");
            setShowAssignPopup(false);
            window.location.reload();
        } catch (error) {
            notify.error("!אירעה שגיאה בשיוך משתמש");
        }
    }

    async function removeOwner() {
        if (!cardId) {
            notify.error("Card ID לא נמצא");
            return;
        }
        try {
            await cardsService.assignUserToCard(cardId, "");
            notify.success("!מחקת בעלים לכרטיס בהצלחה");
            window.location.reload();
        } catch (error) {
            notify.error("!אירעה שיגאה בעת ביטול השיוך");
        }
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
                            : <>
                                לא משויך
                            </>
                        }
                        <button className="assign-btn" onClick={fetchUsers}>שיוך</button>
                    </p>
                </div>
            </div>

            <div className="card-buttons">
                <NavLink to={`/cards/${props.card.company}`} className="view-btn">צפייה</NavLink>
                <NavLink to={`/panel/admin/edit/${props.card.id}`} className="edit-btn">עריכה</NavLink>
                <button className="delete-btn" onClick={() => setShowDelete(true)}>מחיקה</button>
            </div>
            {showAssignPopup && (
                <div className="PopUpContainer">
                    <div className="AssignPopup">
                        <div className="Assign-PopUp">
                            <span>שייך בעלים ל {props.card.company}</span>
                            <ul>
                                {users.map(user => (
                                    <li key={user.userId}>
                                        {user.firstName} {user.lastName}
                                        {user.userId && (
                                            <button className="assign-btn" onClick={() => assignOwner(user.userId)}>שייך</button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            <div className="attach-buttons">
                                <button className="submit-btn" onClick={() => removeOwner()}>מחק שיוך</button>
                                <button className="cancel-btn" onClick={() => setShowAssignPopup(false)}>סגירה</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showDelete && (
                <div className="PopUpContainer">
                    <div className="DeleteContainer">
                        <div className="Delete-PopUp">
                            <span>מוחק את {props.card.company}</span>
                            <p>האם אתה בטוח שברצונך למחוק את {props.card.company}?</p>
                            <div className="delete-buttons">
                                <button onClick={deleteCard} className="submit-btn">מחיקה</button>
                                <button className="cancel-btn" onClick={() => setShowDelete(false)}>ביטול</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cards;
