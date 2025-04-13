import { createStore } from "redux";
import SocialModel from "../models/socialModel";

export class SocialState {
    public socials: SocialModel[] = [];
}

export enum SocialActionType {
    setSocial = 'setSocial',
    addSocial = 'addSocial',
    deleteSocial = 'deleteSocial',
    updateSocial = 'updateSocial'
}

export type SocialActionPayload = SocialModel[] | SocialModel | number | string;
export interface SocialAction {
    type: SocialActionType,
    payload: SocialActionPayload
}

export function SocialReducer(currentState = new SocialState(), action: SocialAction): SocialState {
    const newState = { ...currentState }

    switch (action.type) {
        case SocialActionType.setSocial:
            newState.socials = action.payload as SocialModel[];
            break;
        case SocialActionType.addSocial:
            const singleSocial = action.payload as SocialModel;
            newState.socials.push(singleSocial);
            break;
        case SocialActionType.deleteSocial:
            const SocialId = action.payload as string;
            const indexToDelete = newState.socials.findIndex(socials => socials.id === SocialId);
            if (indexToDelete !== -1) newState.socials.splice(indexToDelete, 1);
            break;
        case SocialActionType.updateSocial:
            const SocialToUpdate = action.payload as SocialModel;
            const indexToUpdate = newState.socials.findIndex(socials => socials.id === SocialToUpdate.id);
            if (indexToUpdate !== -1) newState.socials[indexToUpdate] = SocialToUpdate;
            break;
    }
    return newState;
}

export const SocialsStore = createStore(SocialReducer);
