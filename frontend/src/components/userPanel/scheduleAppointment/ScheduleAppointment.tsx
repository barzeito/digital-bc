import { useState } from "react";
import "./ScheduleAppointment.css";
import notify from "../../../services/popupMessage";
import appointmentsService from "../../../services/appointmentsService";

function ScheduleAppointment({ companyId }: { companyId: string }): JSX.Element {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        message: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.phone || !formData.date || !formData.time) {
            notify.error("אנא מלא את כל השדות הנדרשים");
            return;
        }

        const newAppointment = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            date: formData.date,
            time: formData.time,
            message: formData.message,
        };

        try {
            const response = await appointmentsService.bookAppointment(companyId, newAppointment);
            notify.success("התור הוזמן בהצלחה!");
        } catch (error) {
            notify.error("אירעה שגיאה בהזמנת התור");
        }
    };
    return (
        <div className="ScheduleAppointment">
            <p>הזמנת תור</p>
            <form className="sa-form" onSubmit={handleSubmit}>
                    <label>שם</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <label>אימייל</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <label>טלפון</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                    <label>תאריך</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                    <label>שעה</label>
                    <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                    />
                    <label>הערות</label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                    />
                <button type="submit" className="submit-btn">הזמן תור</button>
            </form>
        </div>
    );
}

export default ScheduleAppointment;
