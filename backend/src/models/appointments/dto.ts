import { UploadedFile } from "express-fileupload";

export default interface DTO {
    appId: string;
    company_id: string;
    company: string;
    days_schedule: JSON;
    slot_interval: number;
}
