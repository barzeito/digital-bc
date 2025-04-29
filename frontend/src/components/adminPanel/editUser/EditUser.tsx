import { useNavigate, useParams } from "react-router-dom";
import "./EditUser.css";
import { useForm } from "react-hook-form";
import userModel from "../../../models/userModel";
import { useEffect } from "react";
import authService from "../../../services/authService";
import notify from "../../../services/popupMessage";
import AdminMenu from "../AdminMenu/AdminMenu";
import DashboardLayout from "../dashboardLayout/DashboardLayout";

function EditUser(): JSX.Element {
    const params = useParams();
    const userId = String(params.id);
    const navigate = useNavigate();

    const { register, handleSubmit, setValue, formState } = useForm<userModel>();

    useEffect(() => {
        if (userId) {
            const userIs = authService.getOne(userId)
                .then(userFromServer => {
                    if (userFromServer) {
                        setValue('firstName', userFromServer.firstName);
                        setValue('lastName', userFromServer.lastName);
                        setValue('email', userFromServer.email);
                        setValue('password', userFromServer.password)
                        setValue('roleId', userFromServer.roleId);
                    } else {
                        notify.error("User not found");
                        console.log("user From server: " + userIs)
                    }
                })
                .catch(error => notify.error(error))
        } else {
            notify.error("User ID is missing");
        }
    }, [userId, setValue]);

    async function submitUserUpdate(user: userModel) {
        try {
            user.userId = userId;
            await authService.editUser(user);
            notify.success("המשתמש עודכן בהצלחה!");
            navigate("/panel/admin/users");
        } catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="EditUser">
            <DashboardLayout>
            <h2>עריכת משתמש</h2>
            <form onSubmit={handleSubmit(submitUserUpdate)}>
                <div className="edit-row">
                    <div className="edit-group">
                        <label>שם פרטי:</label>
                        <input
                            type="text"
                            {...register('firstName', {
                                required: { value: true, message: "שדה חובה!" },
                                minLength: { value: 2, message: "מינימום 2 תווים." }
                            })}
                        />
                        <span className="error">{formState.errors.firstName?.message}</span>
                    </div>

                    <div className="edit-group">
                        <label>שם משפחה:</label>
                        <input
                            type="text"
                            {...register('lastName', {
                                required: { value: true, message: "שדה חובה!" },
                                minLength: { value: 2, message: "מינימום 2 תווים." }
                            })}
                        />
                        <span className="error">{formState.errors.lastName?.message}</span>
                    </div>
                </div>

                <div className="edit-row">
                    <div className="edit-group">
                        <label>אימייל:</label>
                        <input
                            type="text"
                            {...register('email', {
                                required: { value: true, message: "שדה חובה!" },
                                pattern: {
                                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                    message: "אימייל אינו תקין."
                                }
                            })}
                        />
                        <span className="error">{formState.errors.email?.message}</span>
                    </div>

                    <div className="edit-group">
                        <label>סיסמה:</label>
                        <input
                            type="password"
                            {...register('password')}
                        />
                        <span className="error">{formState.errors.password?.message}</span>
                    </div>

                    <div className="edit-group">
                        <label>תפקיד:</label>
                        <select
                            {...register('roleId', {
                                required: { value: true, message: "שדה חובה!" }
                            })}
                        >
                            <option value="">בחר תפקיד</option>
                            <option value="1">משתמש</option>
                            <option value="3">פרימיום</option>
                            <option value="2">אדמין</option>

                        </select>
                        <span className="error">{formState.errors.roleId?.message}</span>
                    </div>
                </div>

                <div className="editUser-buttons">
                    <button className="submit-btn">שמירה</button>
                    <button type="button" className="cancel-btn" onClick={() => navigate("/panel/admin/users")}>ביטול</button>
                </div>
            </form>
            </DashboardLayout>

        </div>
    );
}

export default EditUser;
