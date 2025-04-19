import { promises } from 'dns';
import DTO from './dto';

export default interface Model {
    getAll(): Promise<DTO[]>;
    getOne(id: string): Promise<DTO>;
    getOneByCompanyId(id: string): Promise<DTO>;
    add(app: DTO): Promise<DTO>;
    // deleteApp(id: string): Promise<boolean>;
    // update(app: DTO): Promise<DTO>;
}