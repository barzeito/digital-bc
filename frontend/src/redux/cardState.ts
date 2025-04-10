import { createStore } from "redux";
import CardModel from "../models/cardModel";

export class CardsState {
    public cards: CardModel[] = [];
}

export enum CardsActionType {
    setCard = 'setCard',
    addCard = 'addCard',
    deleteCard = 'deleteCard',
    updateCard = 'updateCard'
}

export type CardsActionPayload = CardModel[] | CardModel | number | string;
export interface CardsAction {
    type: CardsActionType,
    payload: CardsActionPayload
}

export function CardReducer(currentState = new CardsState(), action: CardsAction): CardsState {
    const newState = { ...currentState }

    switch (action.type) {
        case CardsActionType.setCard:
            newState.cards = action.payload as CardModel[];
            break;
        case CardsActionType.addCard:
            const singleCard = action.payload as CardModel;
            newState.cards.push(singleCard);
            break;
        case CardsActionType.deleteCard:
            const cardId = action.payload as string;
            const indexToDelete = newState.cards.findIndex(card => card.id === cardId);
            if (indexToDelete !== -1) newState.cards.splice(indexToDelete, 1);
            break;
        case CardsActionType.updateCard:
            const cardToUpdate = action.payload as CardModel;
            const indexToUpdate = newState.cards.findIndex(card => card.id === cardToUpdate.id);
            if (indexToUpdate !== -1) newState.cards[indexToUpdate] = cardToUpdate;
            break;
    }
    return newState;
}

export const CardsStore = createStore(CardReducer);
