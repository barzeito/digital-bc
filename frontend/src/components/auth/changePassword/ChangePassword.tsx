import { useNavigate, useParams } from "react-router-dom";
import "./ChangePassword.css";
import notify from "../../../services/popupMessage"
import authService from "../../../services/authService";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface ChangePasswordModel {
    password: string;
    confirmPassword: string;
}

function ChangePassword(): JSX.Element {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<ChangePasswordModel>();
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const checkLoginStatus = async () => {
            const loggedIn = await authService.isLoggedIn();
            if (!loggedIn) {
                navigate("/");
            }
        };
        checkLoginStatus();
    }, [navigate]);

    async function submitChangePassword(data: ChangePasswordModel) {
        try {
            if (data.password !== data.confirmPassword) {
                return;
            }
            if (!id) {
                return;
            }
            await authService.changePassword(id, data.password);
            notify.success("!סיסמתך שונתה בהצלחה");
            navigate("/");
        } catch (err) {
            notify.error("!אירעה שגיאה בעת שינוי הסיסמא, אנא נסה שוב");
        }
    }


    return (
        <div className="ChangePassword">
            <div className="changePassword-header">
                <h2>Change Password</h2>
            </div>
            <div className="changePassword-body">
                <form onSubmit={handleSubmit(submitChangePassword)}>
                    <div className="form-group">
                        <label>הזן סיסמא חדשה:</label>
                        <input type="password" {...register('password', { required: "שדה חובה!" })} className="form-control" />
                        <div className="error-message">{errors.password?.message}</div>
                    </div>
                    <div className="form-group">
                        <label>אימות סיסמא חדשה:</label>
                        <input type="password" {...register('confirmPassword', {
                            required: "שדה חובה!",
                            validate: (value) => value === watch('password') || "הסיסמאות אינן זהות!"
                        })} className="form-control" />
                        <div className="error-message">{errors.confirmPassword?.message}</div>
                    </div>
                    <button type="submit" className="changePassword-btn btn-primary">החלף סיסמא</button>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;
