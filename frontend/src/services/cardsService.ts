import axios from "axios";
import { CardsAction, CardsActionType, CardsStore } from "../redux/cardState";
import appConfig from "../utils/AppConfig";
import CardModel from "../models/cardModel";

class CardsService {
    public async getAll(): Promise<CardModel[]> {
        const response = await axios.get<{ cards: CardModel[] }>(appConfig.cardsUrl);
        const cards = response.data.cards || response.data;

        const action: CardsAction = {
            type: CardsActionType.setCard,
            payload: cards
        }
        CardsStore.dispatch(action);
        return cards;
    }

    public async getOne(id: string): Promise<CardModel | undefined> {
        let cards = CardsStore.getState().cards;
        let card = cards.find(c => c.id === id);
        if (!card) {
            await this.getAll();
            cards = CardsStore.getState().cards;
            card = cards.find(c => c.id === id);
        }
        return card;
    }

    public async addCard(card: CardModel): Promise<CardModel> {
        const response = await axios.post<CardModel>(appConfig.cardsUrl, card, {
            validateStatus: function (status) {
                return status >= 200 && status < 500;
            }
        });
        if (response.status === 400) {
            throw response.data;
        }
        const newCard = response.data;
        const action: CardsAction = {
            type: CardsActionType.addCard,
            payload: newCard
        }
        CardsStore.dispatch(action);
        return newCard
    }

    public async deleteCard(id: string): Promise<void> {
        await axios.delete(appConfig.cardsUrl + `/${id}`);
        const action: CardsAction = {
            type: CardsActionType.deleteCard,
            payload: id
        }
        CardsStore.dispatch(action);
    }

    public async getByName(name: string): Promise<CardModel | undefined> {
        let cards = CardsStore.getState().cards;
        let card = cards.find(c => c.company === name);
        if (!card) {
            await this.getAll();
            cards = CardsStore.getState().cards;
            card = cards.find(c => c.company === name);
        }
        return card;
    }

    public async editCard(card: CardModel): Promise<CardModel> {
        const formData = new FormData();

        // Check through the 'card' object and add each field to formdata
        Object.entries(card).forEach(([key, value]) => {
            // Check if the value is defined and not one of the file or social fields
            if (
                value !== undefined &&
                key !== 'coverImageFile' &&
                key !== 'profileImageFile' &&
                key !== 'social'
            ) {
                // Append each field to the formdata, converting null to a string
                formData.append(key, value === null ? 'null' : String(value));
            }
        });

        // Check if a cover image file is provided and append it to the FormData
        if (card.coverImageFile) {
            formData.append("coverImageFile", card.coverImageFile);
        } else if ((card as any).deleteCoverImage) {
            // If no new cover image is provided, delete the existing one, add delete flag
            formData.append("deleteCoverImage", "true");
        }

        if (card.profileImageFile) {
            formData.append("profileImageFile", card.profileImageFile);
        } else if ((card as any).deleteProfileImage) {
            formData.append("deleteProfileImage", "true");
        }
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        const response = await axios.patch<CardModel>(appConfig.cardsUrl + `/${card.id}`, formData, config);
        if (response.status === 400) {
            throw response.data;
        }
        const updatedCard = response.data;
        const action: CardsAction = {
            type: CardsActionType.updateCard,
            payload: updatedCard
        };

        CardsStore.dispatch(action);
        return updatedCard;
    }

    public async assignUserToCard(cardId: string, userId: string | null): Promise<CardModel> {
        const response = await axios.patch<CardModel>(`${appConfig.cardsUrl}/assign-owner/${cardId}`, { ownedBy: userId }, {
            validateStatus: function (status) {
                return status >= 200 && status < 500;
            }
        });
        if (response.status === 400) {
            throw response.data;
        }
        const updatedCard = response.data;
        const action: CardsAction = {
            type: CardsActionType.updateCard,
            payload: updatedCard
        };
        CardsStore.dispatch(action);
        return updatedCard;
    }

    public async getUserCards(userId: string): Promise<CardModel[]> {
        const response = await axios.get<{ cards: CardModel[] }>(appConfig.cardsUrl + `/userCards/${userId}`);
        const cards = response.data.cards || response.data;

        const action: CardsAction = {
            type: CardsActionType.setCard,
            payload: cards
        }
        CardsStore.dispatch(action);
        return cards;
    }

    public async getColors(id: string): Promise<CardModel | null> {
        const response = await axios.get<CardModel>(appConfig.cardsUrl + `/colors/${id}`);
        const cards = response.data;

        const action: CardsAction = {
            type: CardsActionType.setCard,
            payload: cards
        }
        CardsStore.dispatch(action);
        return cards;
    }

}

const cardsService = new CardsService();
export default cardsService;