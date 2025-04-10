import axios from "axios";
import signInModel from "../models/signInModel";
import appConfig from "../utils/AppConfig";
import { AuthAction, AuthActionType, authStore } from "../redux/authState";
import { jwtDecode } from "jwt-decode";
import SignUpModel from "../models/signUpModel";

class AuthService {

    public async signUp(signup: SignUpModel): Promise<SignUpModel> {
        const response = await axios.post<{ jwt: string, user: SignUpModel }>(appConfig.signUpUrl, signup);
        const token = response.data.jwt;
        const user = response.data.user;
        const action: AuthAction = {
            type: AuthActionType.signUp,
            payload: token
        }
        authStore.dispatch(action);

        return user;
    }

    public async signIn(signIn: signInModel): Promise<string> {
        const response = await axios.post<{ jwt: string, user?: any }>(appConfig.signInUrl, signIn);
        const token = response.data.jwt;
        const user = response.data.user;
        const action: AuthAction = {
            type: AuthActionType.signIn,
            payload: { token, user }
        }
        authStore.dispatch(action);
        return authStore.getState().token;
    }

    public logout() {
        const action: AuthAction = {
            type: AuthActionType.logOut,
            payload: null
        }
        authStore.dispatch(action);
    }

    public async isAdmin(id: string): Promise<boolean> {
        try {
            const response = await axios.get(appConfig.isAdminUrl + `/${id}`);
            const isAdmin = response.data === true;
            return isAdmin;
        } catch (error) {
            throw error;
        }
    }

    public isLoggedIn(): boolean {
        const token = localStorage.getItem("dbcToken");
        if (!token) return false;

        try {
            const decoded: any = jwtDecode(token);
            const now = Date.now() / 1000;
            return decoded.exp > now;
        } catch (err) {
            return false;
        }
    }

    public async changePassword(userId: string, newPassword: string): Promise<void> {
        try {
            await axios.patch(appConfig.changePasswordUrl + `/${userId}`, {
                password: newPassword
            });
        } catch (error) {
            throw error;
        }
    }
}

const authService = new AuthService();
export default authService;