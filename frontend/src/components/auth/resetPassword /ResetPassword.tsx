import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./ResetPassword.css";
import notify from "../../../services/popupMessage"
import authService from "../../../services/authService";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Loader from "../../layout/loader/Loader";

interface ChangePasswordModel {
    password: string;
    confirmPassword: string;
}

function ResetPassword(): JSX.Element {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<ChangePasswordModel>();
    const navigate = useNavigate();
    const { search } = useLocation();
    const token = new URLSearchParams(search).get("token");
    const [loading, setLoading] = useState(false);


    async function submitChangePassword(data: ChangePasswordModel) {
        try {
            setLoading(true);
            if (data.password !== data.confirmPassword) {
                return;
            }
            if (!token) {
                notify.error(".הקישור אינו תקף או פג תוקף אנא אפס סיסמא ונסה שוב")
                return;
            }
            await authService.resetPassword(token, data.password);
            notify.success("!סיסמתך שונתה בהצלחה");
            navigate("/");
        } catch (err) {
            notify.error(".הקישור אינו תקף או פג תוקף אנא אפס סיסמא ונסה שוב");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="ResetPassword">
            <div className="resetPassword-header">
                <h2>שינוי סיסמא</h2>
            </div>
            <div className="resetPassword-body">
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
                    {!loading ? (
                        <>
                            <button type="submit" className="resetPassword-btn btn-primary">החלף סיסמא</button>
                        </>
                    ) : (
                        <Loader />
                    )}
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
