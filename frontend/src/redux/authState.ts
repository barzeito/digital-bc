import { jwtDecode } from "jwt-decode";
import { createStore } from "redux";

export class AuthState {
    public token: string = '';
    public constructor() {
        this.token = localStorage.getItem('dbcToken') || '';
    }
}

export enum AuthActionType {
    signUp = 'signUp',
    signIn = 'signIn',
    logOut = 'logOut',
    tokenExpired = 'tokenExpired'
}

const isTokenExpired = (token: string): boolean => {
    const decodedToken: any = jwtDecode(token);
    const currentTime: number = Date.now() / 1000;
    return decodedToken.exp < currentTime;
}

export type AuthActionPayload = string | null;
export interface AuthAction {
    type: AuthActionType,
    payload: AuthActionPayload
}

export function authReducer(currentState = new AuthState(), action: AuthAction): AuthState {
    const newState = { ...currentState }

    switch (action.type) {
        // case AuthActionType.signUp:
        case AuthActionType.signIn:
            newState.token = action.payload as string;
            localStorage.setItem('dbcToken', newState.token);
            break;
        case AuthActionType.logOut:
        case AuthActionType.tokenExpired:
            newState.token = '';
            localStorage.removeItem('dbcToken');
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