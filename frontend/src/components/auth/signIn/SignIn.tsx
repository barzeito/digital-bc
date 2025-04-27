import { useNavigate } from "react-router-dom";
import signInModel from "../../../models/signInModel";
import authService from "../../../services/authService";
import "./SignIn.css";
import { useForm } from "react-hook-form";
import { authStore } from "../../../redux/authState";
import { useEffect, useState } from "react";
import notify from "../../../services/popupMessage"
import { NavLink } from "react-router-dom";
import Loader from "../../layout/loader/Loader";

function SignIn(): JSX.Element {

    const { register, handleSubmit, formState } = useForm<signInModel>();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = authStore.getState().token;
        if (token) {
            navigate('/');
        }
    })

    async function submitSignInData(signInModel: signInModel): Promise<void> {
        try {
            setLoading(true);
            await authService.signIn(signInModel);
            notify.success(".התחברת בהצלחה למערכת");
            const user = authStore.getState().user;
            if (user?.isTemporaryPassword) {
                navigate(`/settings/change-password/${user.userId}`);
            } else {
                navigate('/')
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "שגיאה כללית";
            notify.error(errorMessage);
            console.warn("שגיאת התחברות:", error);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="SignIn">
            <h2>התחברות למערכת</h2>
            <form onSubmit={handleSubmit(submitSignInData)}>
                <label>
                    אימייל לקוח:
                    <input type="email" {...register('email',
                        {
                            required: {
                                value: true,
                                message: "שדה חובה!"
                            },
                        })} /><span>{formState.errors.email?.message}</span>
                </label>
                <label>
                    סיסמאת לקוח:
                    <input type="password" {...register('password',
                        {
                            required: {
                                value: true,
                                message: "שדה חובה!"
                            },
                        })} /><span>{formState.errors.password?.message}</span>

                </label>
                {!loading ? (
                    <>
                        <button type="submit">התחבר</button>
                        <NavLink to={"/settings/forgot-password"} className="forgotPassword-Link">שכחתי סיסמא</NavLink>                        </>
                ) : (
                    <Loader />
                )}
            </form>
        </div>
    );
}

export default SignIn;
