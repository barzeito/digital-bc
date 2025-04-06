import { useNavigate } from "react-router-dom";
import signInModel from "../../../models/signInModel";
import authService from "../../../services/authService";
import notify from "../../../services/Notify";
import "./SignIn.css";
import { useForm } from "react-hook-form";
import { authStore } from "../../../redux/authState";

function SignIn(): JSX.Element {

    const { register, handleSubmit } = useForm<signInModel>();
    const navigate = useNavigate();

    async function submitSignInData(signInModel: signInModel): Promise<void> {
        try {
            await authService.signIn(signInModel);
            notify.success('logged in')
            const user = authStore.getState().user;
            if (user && user.isTemporaryPassword) {
                navigate(`/change-password/${user.userId}`);
            } else {
                navigate('/')
            }
        } catch (error) {
            notify.error(error);
        }
    }

    return (
        <div className="SignIn">
            <h2>Login</h2>
            <form onSubmit={handleSubmit(submitSignInData)}>
                <label>
                    Email:
                    <input type="email" {...register('email')} />
                </label>
                <label>
                    Password:
                    <input type="password" {...register('password')} />
                </label>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default SignIn;
