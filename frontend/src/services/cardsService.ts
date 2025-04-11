import axios from "axios";
import { CardsAction, CardsActionType, CardsStore } from "../redux/cardState";
import appConfig from "../utils/AppConfig";
import CardModel from "../models/cardModel";

class CardsService {
    public async getAll(): Promise<CardModel[]> {
        const response = await axios.get<{cards: CardModel[]}>(appConfig.cardsUrl);
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
        const response = await axios.post<CardModel>(appConfig.cardsUrl, card);
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
        // const config = {
        //     headers: {
        //         'Content-Type': 'multipart/form-data'
        //     }
        // };//TODO: enable when will add logo+banner photos
        const response = await axios.patch<CardModel>(appConfig.cardsUrl + `/${card.id}`, card);
        const updatedCard = response.data;
        const action: CardsAction = {
            type: CardsActionType.updateCard,
            payload: updatedCard
        };
        CardsStore.dispatch(action);
        return updatedCard;
    }
}

const cardsService = new CardsService();
export default cardsService;