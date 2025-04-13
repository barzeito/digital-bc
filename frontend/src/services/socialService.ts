import axios from "axios";
import appConfig from "../utils/AppConfig";
import SocialModel from "../models/socialModel";
import { SocialAction, SocialActionType, SocialsStore } from "../redux/socialState";

class SocialService {
    public async getAll(): Promise<SocialModel[]> {
        const response = await axios.get<{ socials: SocialModel[] }>(appConfig.socialUrl);
        const socials = response.data.socials || response.data;

        const action: SocialAction = {
            type: SocialActionType.setSocial,
            payload: socials
        }
        SocialsStore.dispatch(action);
        return socials;
    }

    public async getOne(id: string): Promise<SocialModel | undefined> {
        let socials = SocialsStore.getState().socials;
        let card = socials.find(c => c.id === id);
        if (!card) {
            await this.getAll();
            socials = SocialsStore.getState().socials;
            card = socials.find(c => c.id === id);
        }
        return card;
    }

    public async getByCompanyPlatform(company_id: string, platform: string): Promise<SocialModel | undefined> {
        try {
            const response = await axios.get(appConfig.socialUrl + `/check/${company_id}/${platform}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async addSocial(card: SocialModel): Promise<SocialModel> {
        const response = await axios.post<SocialModel>(appConfig.socialUrl, card);
        const newCard = response.data;
        const action: SocialAction = {
            type: SocialActionType.addSocial,
            payload: newCard
        }
        SocialsStore.dispatch(action);
        return newCard
    }

    public async deleteSocial(id: string): Promise<void> {
        await axios.delete(appConfig.socialUrl + `/${id}`);
        const action: SocialAction = {
            type: SocialActionType.deleteSocial,
            payload: id
        }
        SocialsStore.dispatch(action);
    }

    public async editSocial(social: SocialModel): Promise<SocialModel> {
        const response = await axios.patch<SocialModel>(appConfig.socialUrl + `/${social.company_id}`, social);
        const updatedCard = response.data;
        const action: SocialAction = {
            type: SocialActionType.updateSocial,
            payload: updatedCard
        };
        SocialsStore.dispatch(action);
        return updatedCard;
    }

}

const socialService = new SocialService();
export default socialService;