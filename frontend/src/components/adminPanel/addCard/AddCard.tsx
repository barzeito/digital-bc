import { useForm } from "react-hook-form";
import CardModel from "../../../models/cardModel";
import "./AddCard.css";
import { NavLink, useNavigate } from "react-router-dom";
import cardsService from "../../../services/cardsService";
import notify from "../../../services/Notify";
import AdminMenu from "../AdminMenu/AdminMenu";
import SignUpModel from "../../../models/signUpModel";
import authService from "../../../services/authService";

function AddCard(): JSX.Element {
    const { register, handleSubmit, setValue, formState, control, getValues, watch } = useForm<CardModel>();
    const navigate = useNavigate();
    const showUserFields = watch("user");

    async function submitNewCard(card: CardModel) {
        try {
            let userId: string | undefined;

            if (showUserFields) {
                const user = getValues("user");
                const signUpModel = new SignUpModel();
                signUpModel.firstName = user?.firstName;
                signUpModel.lastName = user?.lastName;
                signUpModel.email = user?.email;

                const newUser = await authService.signUp(signUpModel);
                userId = newUser.userId;
            }

            if (userId) {
                card.ownedBy = userId;
            }else{
                card.ownedBy = undefined;
            }
            delete card.user;

            await cardsService.addCard(card);

            notify.success('New card added successfully');

            setValue('company', '');
            setValue('description', '');
            setValue('address', '');
            setValue('email', '');
            setValue('phone', '');
            setValue('website', '');
            setValue('user', undefined);

            navigate("/panel/admin/cards");

        } catch (error) {
            notify.error(error);
        }
    }


    return (
        <div className="AddCard">
            <AdminMenu />
            <h2>יצירת כרטיס חדש</h2>
            <form onSubmit={handleSubmit(submitNewCard)}>
                <div className="add-row">
                    <div className="add-group">
                        <label>שם החברה:</label>
                        <input type="text" {...register('company', {
                            minLength: { value: 4, message: 'שם החברה חייב להיות מינימום 4 תווים.' },
                            required: { value: true, message: 'שדה חובה!' }
                        })} />
                        <span className="error">{formState.errors.company?.message}</span>
                    </div>

                    <div className="add-group">
                        <label>תיאור החברה:</label>
                        <input type="text" {...register('description', {
                            minLength: { value: 6, message: 'תיאור החברה חייב להיות מינימום 6 תווים.' },
                            required: { value: true, message: 'שדה חובה!' }
                        })} />
                        <span className="error">{formState.errors.description?.message}</span>
                    </div>

                    <div className="add-group">
                        <label>אימייל:</label>
                        <input type="text" {...register('email', {
                            pattern: { value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, message: 'אימייל אינו תקין.' },
                            required: { value: true, message: 'שדה חובה!' }
                        })} />
                        <span className="error">{formState.errors.email?.message}</span>
                    </div>
                </div>

                <div className="add-row">
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
                            pattern: {
                                value: /^((https?:\/\/)?(www\.)?[\w\-]+\.[a-z]{2,})(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i,
                                message: 'כתובת האתר אינה תקינה.'
                            },
                            required: { value: true, message: 'שדה חובה!' }
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
                                <label>שם משתמש:</label>
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
                    <button className="submit-btn">שמירה</button>
                    <NavLink to="/panel/admin/cards" className="cancel-btn">ביטול</NavLink>
                </div>
            </form>
        </div>
    );
}

export default AddCard;