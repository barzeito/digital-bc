import { useState } from "react";
import "./Cards.css";
import cardsService from "../../../services/cardsService";
import notify from "../../../services/popupMessage";
import CardModel from "../../../models/cardModel";
import { cardFormatDate } from "../../../utils/formateDate";
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

    // פונקציית מחיקת כרטיס
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

    // פונקציה להציג את המשתמשים ולהשייך בעלים לכרטיס
    async function fetchUsers() {
        try {
            const allUsers = await authService.getAllUsers();
            setUsers(allUsers);
            setShowAssignPopup(true);
        } catch (error) {
            notify.error("לא ניתן לטעון משתמשים");
        }
    }

    // פונקציה לשיוך משתמש לכרטיס
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

    // פונקציה להסרת בעלות
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
            notify.error("!אירעה שגיאה בעת ביטול השיוך");
        }
    }

    return (
        <>
            <tr>
                <td>{props.card.company}</td>
                <td>{props.card.created_at && cardFormatDate(props.card.created_at)}</td>
                <td>{props.card.updated_at && cardFormatDate(props.card.updated_at)}</td>
                <td>{props.card.email}</td>
                <td>{props.card.phone}</td>
                <td>
                    {props.card.firstName
                        ? `${props.card.firstName} ${props.card.lastName}`
                        : "לא משויך"
                    }
                    <button className="assign-btn" onClick={fetchUsers}>שיוך</button>
                </td>
                <td className="cardActions">
                    <NavLink to={`/cards/${props.card.company}`} className="action-btn viewCard-btn">צפייה</NavLink>
                    <NavLink to={`/panel/admin/edit/${props.card.id}`} className="action-btn editCard-btn">עריכה</NavLink>
                    <button className="deleteCard-btn" onClick={() => setShowDelete(true)}>מחיקה</button>
                </td>
            </tr>

            {/* פופאפ שיוך בעלים */}
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

            {/* פופאפ מחיקה */}
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
        </>
    );
}

export default Cards;
