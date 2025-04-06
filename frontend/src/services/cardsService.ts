import axios from "axios";
import { CardsAction, CardsActionType, CardsStore } from "../redux/cardState";
import appConfig from "../utils/AppConfig";
import CardModel from "../models/cardModel";

class CardsService {
    public async getAll(): Promise<CardModel[]> {
        let cards = CardsStore.getState().card;
        if (cards.length === 0) {
            const response = await axios.get<CardModel[]>(appConfig.cardsUrl);
            cards = response.data;
            const action: CardsAction = {
                type: CardsActionType.setCard,
                payload: cards
            }
            CardsStore.dispatch(action);
        }
        return cards;
    }

    public async getOne(id: string): Promise<CardModel | undefined> {
        let cards = CardsStore.getState().card;
        let card = cards.find(c => c.id);
        if (!card) {
            await this.getAll();
            cards = CardsStore.getState().card;
            card = cards.find(c => c.id === id);
        }
        return card;
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
        let cards = CardsStore.getState().card;
        let card = cards.find(c => c.company === name);
        if (!card) {
            await this.getAll();
            cards = CardsStore.getState().card;
            card = cards.find(c => c.company === name);
        }
        return card;
    }
}

const cardsService = new CardsService();
export default cardsService;