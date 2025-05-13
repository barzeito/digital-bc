import { useForm } from "react-hook-form";
import "./AddUser.css";
import SignUpModel from "../../../models/signUpModel";
import authService from "../../../services/authService";
import notify from "../../../services/popupMessage";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../dashboardLayout/DashboardLayout";
import { useState } from "react";
import Loader from "../../layout/loader/Loader";

function AddUser(): JSX.Element {
    const { register, handleSubmit, formState, reset } = useForm<SignUpModel>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    async function submitNewUser(data: SignUpModel) {
        try {
            setLoading(true);
            await authService.signUp(data);
            notify.success("המשתמש נוצר בהצלחה!");
            reset();
            navigate("/panel/admin/users");
        } catch (error: any) {
            const code = error?.response?.data?.code;
            console.log(error)
            if (code === 'EMAIL_EXISTS') {
                notify.error("האימייל כבר בשימוש.");
            } else {
                notify.error("אירעה שגיאה. נסה שוב.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="AddUser">
            <DashboardLayout>
                <h2>יצירת משתמש חדש</h2>
                <form onSubmit={handleSubmit(submitNewUser)}>
                    <div className="add-row">
                        <div className="add-group">
                            <label>שם פרטי:</label>
                            <input type="text" {...register('firstName', {
                                required: { value: true, message: 'שדה חובה!' }
                            })} />
                            <span className="error">{formState.errors.firstName?.message}</span>
                        </div>

                        <div className="add-group">
                            <label>שם משפחה:</label>
                            <input type="text" {...register('lastName', {
                                required: { value: true, message: 'שדה חובה!' }
                            })} />
                            <span className="error">{formState.errors.lastName?.message}</span>
                        </div>

                        <div className="add-group">
                            <label>אימייל:</label>
                            <input type="text" {...register('email', {
                                required: { value: true, message: 'שדה חובה!' },
                                pattern: {
                                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                    message: 'אימייל לא תקין.'
                                }
                            })} />
                            <span className="error">{formState.errors.email?.message}</span>
                        </div>
                    </div>
                    <div className="add-row">
                        <div className="add-group">
                            <label>תפקיד:</label>
                            <select {...register('roleId', {
                                required: { value: true, message: 'שדה חובה!' }
                            })}>
                                <option value="">בחר תפקיד</option>
                                <option value="2">אדמין</option>
                                <option value="1">משתמש</option>
                                <option value="3">פרימיום</option>

                            </select>
                            <span className="error">{formState.errors.roleId?.message}</span>
                        </div>
                    </div>
                    <div className="buttons">
                        {!loading ? (
                            <>
                                <button className="submit-btn">שמירה</button>
                                <button type="button" className="cancel-btn" onClick={() => navigate("/panel/admin/users")}>ביטול</button>
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

export default AddUser;
