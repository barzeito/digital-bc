import { jwtDecode } from "jwt-decode";
import { createStore } from "redux";
import notify from "../services/popupMessage";
import userModel from "../models/userModel";

export class AuthState {
    public token: string = '';
    public user: any = null;
    public userData: userModel[] = [];
    public constructor() {
        this.token = localStorage.getItem('dbcToken') || '';
    }
}

export enum AuthActionType {
    signUp = 'signUp',
    signIn = 'signIn',
    logOut = 'logOut',
    tokenExpired = 'tokenExpired',
    deleteUser = 'deleteUser',
    setUsers = 'setUsers',
    editUser = 'editUser'
}

const isTokenExpired = (token: string): boolean => {
    const decodedToken: any = jwtDecode(token);
    const currentTime: number = Date.now() / 1000;
    return decodedToken.exp < currentTime;
}

const scheduleLogout = (token: string) => {
    const decoded: any = jwtDecode(token);
    const delay = decoded.exp * 1000 - Date.now();

    if (delay > 0) {
        setTimeout(() => {
            authStore.dispatch({ type: AuthActionType.tokenExpired, payload: null });
            window.location.href = "/home";
            notify.warning("!זמן ההתחברות נגמר אנא התחבר מחדש");
        }, delay);
    }
};

export type AuthActionPayload = userModel[] | userModel | string | null;
export interface AuthAction {
    type: AuthActionType,
    payload: AuthActionPayload | { token: string, user: any }
}


export function authReducer(currentState = new AuthState(), action: AuthAction): AuthState {
    const newState = { ...currentState }

    switch (action.type) {
        case AuthActionType.setUsers:
            newState.userData = action.payload as userModel[];
            break;
        case AuthActionType.signUp:
        case AuthActionType.signIn:
            if (typeof action.payload === 'object' && action.payload !== null) {
                const { token, user } = action.payload as { token: string, user: any };
                newState.token = token;
                newState.user = user;
                localStorage.setItem('dbcToken', newState.token);
                scheduleLogout(newState.token);
            }
            break;
        case AuthActionType.logOut:
        case AuthActionType.tokenExpired:
            newState.token = '';
            newState.user = null;
            localStorage.removeItem('dbcToken');
            break;
        case AuthActionType.deleteUser:
            const userId = action.payload as string;
            const indexToDelete = newState.userData.findIndex(userData => userData.userId === userId);
            if (indexToDelete !== -1) newState.userData.splice(indexToDelete, 1);
            break;
        case AuthActionType.editUser:
            const userToUpdate = action.payload as userModel;
            const indexToUpdate = newState.userData.findIndex(user => user.userId === userToUpdate.userId);
            if (indexToUpdate !== -1) newState.userData[indexToUpdate] = userToUpdate;
            break;
    }
    return newState;
}

export const authStore = createStore(authReducer);

const token = localStorage.getItem('dbcToken');
if (token && isTokenExpired(token)) {
    authStore.dispatch({
        type: AuthActionType.tokenExpired,
        payload: null
    });
}