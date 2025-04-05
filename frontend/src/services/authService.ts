import axios from "axios";
import signInModel from "../models/signInModel";
import appConfig from "../utils/AppConfig";
import { AuthAction, AuthActionType, authStore } from "../redux/authState";

class AuthService {
    public async signIn(signIn: signInModel): Promise<string> {
        const response = await axios.post<{ jwt: string }>(appConfig.signInUrl, signIn);
        console.log("JWT Response:", response.data);
        const token = response.data.jwt;
        const action: AuthAction = {
            type: AuthActionType.signIn,
            payload: token
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
}

const authService = new AuthService;
export default authService;