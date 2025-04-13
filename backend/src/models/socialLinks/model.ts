import { promises } from 'dns';
import DTO from './dto';

export default interface Model {
    getAll(): Promise<DTO[]>;
    getOne(company_id: string): Promise<DTO>;
    update(slink: DTO): Promise<DTO>;
}