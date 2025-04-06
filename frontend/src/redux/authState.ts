import { jwtDecode } from "jwt-decode";
import { createStore } from "redux";

export class AuthState {
    public token: string = '';
    public user: any = null;
    public constructor() {
        this.token = localStorage.getItem('dbcToken') || '';
        const userStr = localStorage.getItem('dbcUser');
        this.user = userStr ? JSON.parse(userStr) : null;
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
    payload: string | null | { token: string, user: any }
}


export function authReducer(currentState = new AuthState(), action: AuthAction): AuthState {
    const newState = { ...currentState }

    switch (action.type) {
        // case AuthActionType.signUp:
        case AuthActionType.signIn:
            if (typeof action.payload === 'object' && action.payload !== null) {
                newState.token = action.payload.token;
                newState.user = action.payload.user;
                localStorage.setItem('dbcToken', newState.token);
                localStorage.setItem('dbcUser', JSON.stringify(newState.user));
            }
            break;
        case AuthActionType.logOut:
        case AuthActionType.tokenExpired:
            newState.token = '';
            newState.user = null;
            localStorage.removeItem('dbcToken');
            localStorage.removeItem('dbcUser');
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