import { Navigate, useNavigate, useParams } from "react-router-dom";
import "./UserCardEdit.css";
import { useForm } from "react-hook-form";
import CardModel from "../../../models/cardModel";
import { useEffect, useState } from "react";
import cardsService from "../../../services/cardsService";
import notify from "../../../services/Notify";
import { authStore } from "../../../redux/authState";
import { jwtDecode } from "jwt-decode";
import { NavLink } from "react-router-dom";
import UserMenu from "../userMenu/UserMenu";

function UserCardEdit(): JSX.Element {
    const params = useParams();
    const cardId = String(params.id);
    const uId = String(params.userId);
    const navigate = useNavigate();
    const [isOwner, setIsOwner] = useState<boolean | null>(null);

    const { handleSubmit, setValue, register, formState } = useForm<CardModel>();

    useEffect(() => {
        const token = authStore.getState().token;

        if (token) {
            const decoded = jwtDecode<{ user: { userId: string } }>(token);
            const currentUserId = decoded.user.userId;
            setIsOwner(currentUserId === uId);
        } else {
            setIsOwner(false);
        }

        const unsubscribe = authStore.subscribe(() => {
            const updatedToken = authStore.getState().token;
            if (updatedToken) {
                const updatedUserId = jwtDecode<{ user: { userId: string } }>(updatedToken).user.userId;
                setIsOwner(updatedUserId === uId);
            } else {
                setIsOwner(false);
            }
        });

        return unsubscribe;
    }, [uId]);

    useEffect(() => {
        cardsService.getOne(cardId)
            .then(cardFromServer => {
                setValue('company', cardFromServer?.company);
                setValue('name', cardFromServer?.about);
                setValue('description', cardFromServer?.description);
                setValue('about', cardFromServer?.about);
                setValue('email', cardFromServer?.email);
                setValue('address', cardFromServer?.address);
                setValue('phone', cardFromServer?.phone);
                setValue('website', cardFromServer?.website);
            })
            .catch(error => notify.error(error));
    }, [cardId, setValue]);

    if (isOwner === null) return <></>;

    if (!isOwner) return <Navigate to="/*" />;


    async function submitCardUpdate(card: CardModel) {
        try {
            card.id = cardId;
            await cardsService.editCard(card);
            notify.success('הכרטיס עודכן בהצלחה');
            console.log(`עדכון הכרטיס ${card.id}`);
            navigate(`/panel/user/${uId}`);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="UserCardEdit">
            <UserMenu />
            <h2>עריכת הכרטיס שלך</h2>
            <form onSubmit={handleSubmit(submitCardUpdate)}>
                <div className="edit-row">
                    <div className="edit-group">
                        <label>שם החברה:</label>
                        <input type="text" {...register('company', {
                            minLength: { value: 2, message: 'שם החברה חייב להיות מינימום 2 תווים.' },
                            required: { value: true, message: 'שדה חובה!' }
                        })} />
                        <span className="error">{formState.errors.company?.message}</span>
                    </div>

                    <div className="edit-group">
                        <label>שם:</label>
                        <input type="text" {...register('name', {
                            minLength: { value: 2, message: 'שם החברה חייב להיות מינימום 2 תווים.' },
                            required: { value: true, message: 'שדה חובה!' }
                        })} />
                        <span className="error">{formState.errors.name?.message}</span>
                    </div>

                    <div className="edit-group">
                        <label>תיאור החברה:</label>
                        <input type="text" {...register('description', {
                            minLength: { value: 2, message: 'תיאור החברה חייב להיות מינימום 2 תווים.' },
                            required: { value: true, message: 'שדה חובה!' }
                        })} />
                        <span className="error">{formState.errors.description?.message}</span>
                    </div>
                </div>
                <div className="edit-row">
                    <div className="edit-group">
                        <label>קצת על עצמי:</label>
                        <textarea {...register('about', {
                            minLength: { value: 2, message: 'תיאור החברה חייב להיות מינימום 2 תווים.' },
                            required: { value: true, message: 'שדה חובה!' }
                        })} />
                        <span className="error">{formState.errors.about?.message}</span>
                    </div>
                </div>
                <div className="edit-row">
                    <div className="edit-group">
                        <label>אימייל:</label>
                        <input type="text" {...register('email', {
                            pattern: { value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, message: 'אימייל אינו תקין.' },
                            required: { value: true, message: 'שדה חובה!' }
                        })} />
                        <span className="error">{formState.errors.email?.message}</span>
                    </div>

                    <div className="edit-group">
                        <label>כתובת:</label>
                        <input type="text" {...register('address', {
                            minLength: { value: 4, message: 'כתובת חייבת להיות מינימום 4 תווים.' },
                            required: { value: true, message: 'שדה חובה!' }
                        })} />
                        <span className="error">{formState.errors.address?.message}</span>
                    </div>

                    <div className="edit-group">
                        <label>מספר טלפון:</label>
                        <input type="text" {...register('phone', {
                            pattern: { value: /^0\d{1,2}-?\d{7}$/, message: 'מספר טלפון אינו תקין.' },
                            required: { value: true, message: 'שדה חובה!' }
                        })} />
                        <span className="error">{formState.errors.phone?.message}</span>
                    </div>

                    <div className="edit-group">
                        <label>אתר אינטרנט:</label>
                        <input type="text" {...register('website', {
                            pattern: {
                                value: /^((https?:\/\/)?(www\.)?[\w\-]+\.[a-z]{2,})(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i,
                                message: 'כתובת האתר אינה תקינה.'
                            },
                            required: { value: true, message: 'שדה חובה!' }
                        })} />
                        <span className="error">{formState.errors.website?.message}</span>
                    </div>
                </div>


                <div className="buttons">
                    <button className="submit-btn">שמירה</button>
                    <NavLink to="/panel/admin/cards" className="cancel-btn">ביטול</NavLink>
                </div>
            </form>
        </div>
    );
}

export default UserCardEdit;
