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

        const action: AuthAction = {
            type: AuthActionType.setUsers,
            payload: users
        }
        authStore.dispatch(action)
        return users;
    }

    public async getOne(id: string): Promise<userModel | undefined> {
        const response = await axios.get<userModel>(`${appConfig.usersUrl}/${id}`);
        return response.data;
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
            const response = await axios.post<{ jwt: string, user?: any, message?: string }>(appConfig.signInUrl, signIn, {
                validateStatus: function (status) {
                    return status >= 200 && status < 500;
                }
            });

            if (response.status === 400) {
                throw new Error(response.data.message || "שם משתמש או סיסמה שגויים");
            }

            const token = response.data.jwt;
            const user = response.data.user;
            const action: AuthAction = {
                type: AuthActionType.signIn,
                payload: { token, user }
            }
            authStore.dispatch(action);
            return authStore.getState().token;

        } catch (error: any) {
            console.warn("שגיאה ב־signIn:", error?.message || error);
            throw new Error(error?.message || "שגיאת התחברות כללית");
        }
    }

    public async editUser(user: userModel): Promise<userModel> {
        const response = await axios.patch<userModel>(`${appConfig.usersUrl}/${user.userId}`, user)
        if (response.status === 400) {
            throw response.data;
        }
        const updatedUser = response.data;
        const action: AuthAction = {
            type: AuthActionType.editUser,
            payload: updatedUser
        };
        authStore.dispatch(action);
        return updatedUser;
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

    public async isPremium(id: string): Promise<boolean> {
        try {
            const response = await axios.get(appConfig.isPremiumUrl + `/${id}`);
            const isPremium = response.data === true;
            return isPremium;
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

    public async forgotPassword(email: string): Promise<void> {
        try {
            await axios.post(appConfig.forgotPasswordUrl, { email });
        } catch (error) {
            throw error;
        }
    }
    public async resetPassword(token: string, newPassword: string): Promise<void> {
        try {
            await axios.patch(`${appConfig.resetPasswordUrl}?token=${token}`, { password: newPassword });
        } catch (error) {
            throw error;
        }
    }

    public async deleteUser(id: string): Promise<void> {
        await axios.delete(appConfig.usersUrl + `/${id}`);
        const action: AuthAction = {
            type: AuthActionType.deleteUser,
            payload: id
        }
        authStore.dispatch(action);
    }
}

const authService = new AuthService();
export default authService;