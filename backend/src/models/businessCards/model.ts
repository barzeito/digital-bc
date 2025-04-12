import { promises } from 'dns';
import DTO from './dto';

export default interface Model {
    getAll(): Promise<DTO[]>;
    getOne(id: string): Promise<DTO>;
    getOneById(id: string): Promise<DTO>;
    add(card: DTO): Promise<DTO>;
    deleteCard(id: string): Promise<boolean>;
    update(card: DTO): Promise<DTO>;
    getUserCards(id: string): Promise<DTO>;
}