import { promises } from 'dns';
import DTO from './dto';
import BookDTO from './bookDTO';

export default interface Model {
    getAllAvailable(): Promise<DTO[]>;
    getOneAvailable(id: string): Promise<DTO>;
    getOneByCompanyId(id: string): Promise<DTO>;
    addAvailable(app: DTO): Promise<DTO>;
    // deleteApp(id: string): Promise<boolean>;
    updateAvailable(app: DTO): Promise<DTO>;
    getAvailableTimes(companyId: string): Promise<any>;
    setAppAvailable(companyId: string, isAvailable: boolean): Promise<any>;
    getAppAvailable(companyId: string): Promise<any>;


    getAllAppointments(): Promise<BookDTO[]>;
    getAllAppsByCompany(id: string): Promise<BookDTO[]>;
    getOneAppointment(id: number): Promise<BookDTO>;
    getOneAppByCompany(id: string): Promise<BookDTO>;
    addAppointment(app: BookDTO): Promise<BookDTO>;
    deleteAppointment(id: number): Promise<boolean>;

}