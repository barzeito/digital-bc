import { NavLink, useNavigate, useParams } from "react-router-dom";
import "./EditCard.css";
import { useEffect } from "react";
import cardsService from "../../../services/cardsService";
import { useForm } from "react-hook-form";
import CardModel from "../../../models/cardModel";
import notify from "../../../services/Notify";
import AdminMenu from "../AdminMenu/AdminMenu";

function EditCard(): JSX.Element {

    const params = useParams();
    const cardId = String(params.id);
    console.log(cardId)
    const navigate = useNavigate();

    const { handleSubmit, setValue, register, formState } = useForm<CardModel>();

    useEffect(() => {
        cardsService.getOne(cardId)
            .then(cardFromServer => {
                setValue('company', cardFromServer?.company);
                setValue('description', cardFromServer?.description);
                setValue('email', cardFromServer?.email);
                setValue('address', cardFromServer?.address);
                setValue('phone', cardFromServer?.phone);
                setValue('website', cardFromServer?.website);
            })
            .catch(error => notify.error(error))
    }, [cardId, setValue])

    async function submitCardUpdate(card: CardModel) {
        try {
            card.id = cardId;
            await cardsService.editCard(card);
            notify.success('Card Updated Successfully')
            console.log(`updated ${card.id}`)
            navigate('/panel/admin/cards')
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="EditCard">
            <AdminMenu />
            <h2>עריכת כרטיס</h2>
            <form onSubmit={handleSubmit(submitCardUpdate)}>
                <div className="edit-row">
                    <div className="edit-group">
                        <label>שם החברה:</label>
                        <input type="text" {...register('company', {
                            minLength: { value: 4, message: 'שם החברה חייב להיות מינימום 4 תווים.' },
                            required: {
                                value: true,
                                message: 'שדה חובה!'
                            }
                        })} />
                        <span className="error">{formState.errors.company?.message}</span>
                    </div>

                    <div className="edit-group">
                        <label>תיאור החברה:</label>
                        <input type="text" {...register('description', {
                            minLength: { value: 6, message: 'תיאור החברה חייב להיות מינימום 6 תווים.' },
                            required: {
                                value: true,
                                message: 'שדה חובה!'
                            }
                        })} />
                        <span className="error">{formState.errors.description?.message}</span>
                    </div>

                    <div className="edit-group">
                        <label>אימייל:</label>
                        <input type="text" {...register('email', {
                            pattern: {
                                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                message: 'אימייל אינו תקין.'
                            },
                            required: {
                                value: true,
                                message: 'שדה חובה!'
                            }
                        })} />
                        <span className="error">{formState.errors.email?.message}</span>
                    </div>
                </div>

                <div className="edit-row">
                    <div className="edit-group">
                        <label>כתובת:</label>
                        <input type="text" {...register('address', {
                            minLength: { value: 4, message: 'כתובת חייבת להיות מינימום 4 תווים.' },
                            required: {
                                value: true,
                                message: 'שדה חובה!'
                            }
                        })} />
                        <span className="error">{formState.errors.address?.message}</span>
                    </div>

                    <div className="edit-group">
                        <label>מספר טלפון:</label>
                        <input type="text" {...register('phone', {
                            pattern: {
                                value: /^0\d{1,2}-?\d{7}$/,
                                message: 'מספר טלפון אינו תקין.'
                            },
                            required: {
                                value: true,
                                message: 'שדה חובה!'
                            }
                        })} />
                        <span className="error">{formState.errors.phone?.message}</span>
                    </div>

                    <div className="edit-group">
                        <label>אתר אינטרנט:</label>
                        <input type="text" {...register('website', {
                            pattern: {
                                value: /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/,
                                message: 'כתובת האתר אינה תקינה.'
                            },
                            required: {
                                value: true,
                                message: 'שדה חובה!'
                            }
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

export default EditCard;
