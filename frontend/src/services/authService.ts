import axios from "axios";
import signInModel from "../models/signInModel";
import appConfig from "../utils/AppConfig";
import { AuthAction, AuthActionType, authStore } from "../redux/authState";
import { jwtDecode } from "jwt-decode";
import SignUpModel from "../models/signUpModel";
import userModel from "../models/userModel";

class AuthService {

    public async getAllUsers(): Promise<userModel[]> {
        const response = await axios.get<userModel[]>(appConfig.usersUrl);
        const users = response.data;
        return users;
    }

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
        try {
            const response = await axios.post<{ jwt: string, user?: any }>(appConfig.signInUrl, signIn, {
                validateStatus: function (status) {
                    return status >= 200 && status < 500; 
                }
            });
            if (response.status === 400) {
                throw response.data;
            }
            const token = response.data.jwt;
            const user = response.data.user;
            const action: AuthAction = {
                type: AuthActionType.signIn,
                payload: { token, user }
            }
            authStore.dispatch(action);
            return authStore.getState().token;
        } catch (error) {
            throw error;
        }
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