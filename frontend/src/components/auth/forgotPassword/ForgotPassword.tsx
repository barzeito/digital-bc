import { useForm } from "react-hook-form";
import "./ForgotPassword.css";
import authService from "../../../services/authService";
import notify from "../../../services/popupMessage";
import UserMenu from "../../userPanel/userMenu/UserMenu";
import { useState } from "react";
import Loader from "../../layout/loader/Loader";

function ForgotPassword(): JSX.Element {

    interface forgotPasswordModel {
        email: string;
    }

    const { register, handleSubmit, formState: { errors } } = useForm<forgotPasswordModel>()
    const [loading, setLoading] = useState(false);

    async function submitForgotPassword(data: forgotPasswordModel) {
        try {
            setLoading(true);
            await authService.forgotPassword(data.email);
            notify.success("איפוס סיסמא נשלח למייל בהצלחה");
        } catch (err) {
            console.error("Error during password reset:", err);
            notify.error("איימיל לא קיים במערכת");
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="ForgotPassword">
            <div className="forgotPassword-header">
                <h2>טופס איפוס סיסמא</h2>
            </div>
            <div className="changePassword-body">
                <form onSubmit={handleSubmit(submitForgotPassword)}>
                    <div className="form-group">
                        <label>הזן דואר אלקטרוני:</label>
                        <input type="email" {...register('email', { required: "שדה חובה!" })} className="form-control" />
                        <div className="error-message">{errors.email?.message}</div>
                    </div>
                    {!loading ? (
                        <>
                            <button type="submit" className="forgotPassword-btn btn-primary">איפוס סיסמא</button>
                        </>
                    ) : (
                        <Loader />
                    )}
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
