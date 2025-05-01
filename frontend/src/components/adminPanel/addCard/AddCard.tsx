import { useForm } from "react-hook-form";
import CardModel from "../../../models/cardModel";
import "./AddCard.css";
import { NavLink, useNavigate } from "react-router-dom";
import cardsService from "../../../services/cardsService";
import notify from "../../../services/popupMessage"
import SignUpModel from "../../../models/signUpModel";
import authService from "../../../services/authService";
import { useState } from "react";
import Loader from "../../layout/loader/Loader";
import DashboardLayout from "../dashboardLayout/DashboardLayout";

function AddCard(): JSX.Element {
    const { register, handleSubmit, setValue, formState, getValues, watch } = useForm<CardModel>();
    const navigate = useNavigate();
    const showUserFields = watch("user");
    const [loading, setLoading] = useState(false);

    async function submitNewCard(card: CardModel) {
        try {
            setLoading(true);
            let user: any;
            if (showUserFields) {
                user = getValues("user");
            }

            card.ownedBy = undefined;
            delete card.user;

            const createdCard = await cardsService.addCard(card);

            if (user) {
                const signUpModel = new SignUpModel();
                signUpModel.firstName = user.firstName;
                signUpModel.lastName = user.lastName;
                signUpModel.email = user.email;

                const newUser = await authService.signUp(signUpModel);

                if (createdCard.id && newUser.userId) {
                    await cardsService.assignUserToCard(createdCard.id, newUser.userId);
                }
                notify.success('המשתמש נוצר בהצלחה!');
            }

            notify.success('!הכרטיס נוצר בהצלחה');

            setValue('company', '');
            setValue('name', '')
            setValue('description', '');
            setValue('about', '');
            setValue('address', '');
            setValue('email', '');
            setValue('phone', '');
            setValue('website', '');
            setValue('user', undefined);

            navigate("/panel/admin/cards");

        } catch (error: any) {
            console.error(error);
            const code = error?.code || error?.response?.data?.code || error?.response?.data?.Objectcode;
            console.log('Error code:', code);
            console.log("card error:" + error)

            if (code === 'EMAIL_EXISTS') {
                notify.error("אימייל זה כבר בשימוש. נסה אימייל אחר.");
            } else if (code === 'COMPANY_EXISTS') {
                notify.error("החברה הזו כבר קיימת במערכת.");
            } else {
                notify.error("אירעה שגיאה. נסה שוב.");
            }
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="AddCard">
            <DashboardLayout>
                <h2>יצירת כרטיס חדש</h2>
                <form onSubmit={handleSubmit(submitNewCard)}>
                    <div className="add-row">
                        <div className="add-group">
                            <label>שם החברה באנגלית (ישמש ככתובת הכרטיס):</label>
                            <input type="text" {...register('company', {
                                minLength: { value: 2, message: 'שם החברה חייב להיות מינימום 2 תווים.' },
                                required: { value: true, message: 'שדה חובה!' }
                            })} />
                            <span className="error">{formState.errors.company?.message}</span>
                        </div>

                        <div className="add-group">
                            <label>שם:</label>
                            <input type="text" {...register('name', {
                                minLength: { value: 2, message: 'שם החברה חייב להיות מינימום 2 תווים.' },
                                required: { value: true, message: 'שדה חובה!' }
                            })} />
                            <span className="error">{formState.errors.company?.message}</span>
                        </div>

                        <div className="add-group">
                            <label>תיאור החברה:</label>
                            <input type="text" {...register('description', {
                                minLength: { value: 2, message: 'תיאור החברה חייב להיות מינימום 2 תווים.' },
                                required: { value: true, message: 'שדה חובה!' }
                            })} />
                            <span className="error">{formState.errors.description?.message}</span>
                        </div>
                    </div>
                    <div className="add-row">
                        <div className="add-group">
                            <label>קצת על עצמי:</label>
                            <textarea {...register('about')} />
                            <span className="error">{formState.errors.description?.message}</span>
                        </div>
                    </div>
                    <div className="add-row">
                        <div className="add-group">
                            <label>אימייל:</label>
                            <input type="text" {...register('email', {
                                pattern: { value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, message: 'אימייל אינו תקין.' },
                                required: { value: true, message: 'שדה חובה!' }
                            })} />
                            <span className="error">{formState.errors.email?.message}</span>
                        </div>

                        <div className="add-group">
                            <label>כתובת:</label>
                            <input type="text" {...register('address', {
                                minLength: { value: 4, message: 'כתובת חייבת להיות מינימום 4 תווים.' },
                                required: { value: true, message: 'שדה חובה!' }
                            })} />
                            <span className="error">{formState.errors.address?.message}</span>
                        </div>

                        <div className="add-group">
                            <label>מספר טלפון:</label>
                            <input type="text" {...register('phone', {
                                pattern: { value: /^0\d{1,2}-?\d{7}$/, message: 'מספר טלפון אינו תקין.' },
                                required: { value: true, message: 'שדה חובה!' }
                            })} />
                            <span className="error">{formState.errors.phone?.message}</span>
                        </div>

                        <div className="add-group">
                            <label>אתר אינטרנט:</label>
                            <input type="text" {...register('website', {
                                validate: (value) =>
                                    !value || /^((https?:\/\/)?(www\.)?[\w-]+\.[a-z]{2,})(\/[\w._~:/?#[\]@!$&'()*+,;=-]*)?$/i.test(value)
                                    || 'כתובת האתר אינה תקינה.'
                            })} />
                            <span className="error">{formState.errors.website?.message}</span>
                        </div>
                    </div>

                    <div className="checkbox-group">
                        <input type="checkbox" {...register('user')} id="create-user" />
                        <label htmlFor="create-user">יצירת משתמש עם כרטיס</label>
                    </div>

                    {showUserFields && (
                        <div className="user-fields">
                            <div className="add-row">
                                <div className="add-group">
                                    <label>שם פרטי:</label>
                                    <input type="text" {...register('user.firstName', {
                                        required: { value: true, message: 'שדה חובה!' }
                                    })} />
                                    <span className="error">{formState.errors.user?.firstName?.message}</span>
                                </div>

                                <div className="add-group">
                                    <label>שם משפחה:</label>
                                    <input type="text" {...register('user.lastName', {
                                        required: { value: true, message: 'שדה חובה!' }
                                    })} />
                                    <span className="error">{formState.errors.user?.lastName?.message}</span>
                                </div>

                                <div className="add-group">
                                    <label>אימייל משתמש:</label>
                                    <input type="text" {...register('user.email', {
                                        pattern: {
                                            value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                            message: 'אימייל משתמש לא תקין.'
                                        },
                                        required: { value: true, message: 'שדה חובה!' }
                                    })} />
                                    <span className="error">{formState.errors.user?.email?.message}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="buttons">
                        {!loading ? (
                            <>
                                <button className="submit-btn">שמירה</button>
                                <NavLink to="/panel/admin/cards" className="cancel-btn">ביטול</NavLink>
                            </>
                        ) : (
                            <Loader />
                        )}
                    </div>
                </form>
            </DashboardLayout>
        </div>
    );
}

export default AddCard;