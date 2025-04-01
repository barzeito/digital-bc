import { promises } from 'dns';
import DTO from './dto';

export default interface Model {
    getAll(): Promise<DTO[]>;
    getOne(id: string): Promise<DTO>;
    add(slink: DTO): Promise<DTO>;
    deleteSocial(id: string): Promise<boolean>;
    update(slink: DTO): Promise<DTO>;
}