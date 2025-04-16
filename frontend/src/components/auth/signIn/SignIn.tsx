import { useNavigate } from "react-router-dom";
import signInModel from "../../../models/signInModel";
import authService from "../../../services/authService";
import "./SignIn.css";
import { useForm } from "react-hook-form";
import { authStore } from "../../../redux/authState";
import { useEffect } from "react";
import notify from "../../../services/popupMessage"

function SignIn(): JSX.Element {

    const { register, handleSubmit, formState } = useForm<signInModel>();
    const navigate = useNavigate();

    useEffect(() => {
        const token = authStore.getState().token;
        if (token) {
            navigate('/');
        }
    })

    async function submitSignInData(signInModel: signInModel): Promise<void> {
        try {
            await authService.signIn(signInModel);
            notify.success(".התחברת בהצלחה למערכת");
            const user = authStore.getState().user;
            if (user && user.isTemporaryPassword) {
                navigate(`/settings/change-password/${user.userId}`);
            } else {
                navigate('/')
            }
        } catch (error) {
            if (error instanceof Error) {
                notify.error("!שם משתמש או סיסמא אינם קיימים במערכת");
            } else {
                notify.error("שגיאה לא צפויה");
            }
            // Prevent the error from being thrown in the console
            console.error = () => { };
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
                <button type="submit">התחבר</button>
            </form>
        </div>
    );
}

export default SignIn;
