import { promises } from 'dns';
import DTO from './dto';
import BookDTO from './bookDTO';

export default interface Model {
    getAll(): Promise<DTO[]>;
    getOne(id: string): Promise<DTO>;
    getOneByCompanyId(id: string): Promise<DTO>;
    add(app: DTO): Promise<DTO>;
    // deleteApp(id: string): Promise<boolean>;
    update(app: DTO): Promise<DTO>;
    addBookedAppointment(companyId: string, date: string, time: string): Promise<void>;
    getAvailableTimes(companyId: string): Promise<any>;

    getAllAppointments(): Promise<BookDTO[]>;
    getAllAppsByCompany(id: string): Promise<BookDTO[]>;
    getOneAppointment(id: number): Promise<BookDTO>;
    getOneAppByCompany(id: string): Promise<BookDTO>;
    addAppointment(app: BookDTO): Promise<BookDTO>;
    deleteAppointment(id: number): Promise<boolean>;

}