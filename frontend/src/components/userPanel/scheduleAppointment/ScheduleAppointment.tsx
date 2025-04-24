import { useState } from "react";
import "./ScheduleAppointment.css";
import notify from "../../../services/popupMessage";
import appointmentsService from "../../../services/appointmentsService";

function ScheduleAppointment({ companyId }: { companyId: string }): JSX.Element {

    const [availableTimes, setAvailableTimes] = useState<string[]>([]);


    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        message: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === "date") {
            fetchAppointmentTimes(value);
        }
    };

    const fetchAppointmentTimes = async (selectedDate: string) => {
        try {
            const rawData = await appointmentsService.getAvailableTimes(companyId, selectedDate);

            const [company] = rawData.map((item: any) => ({
                ...item,
                days_schedule: JSON.parse(item.days_schedule),
                booked_appointments: JSON.parse(item.booked_appointments),
            }));

            const dayName = new Date(selectedDate).toLocaleDateString("en-US",
                {
                    weekday: "long",
                    timeZone: "Asia/Jerusalem"
                }).toLowerCase();
                
            const schedule = company.days_schedule[dayName];

            if (!schedule) {
                setAvailableTimes([]);
                return;
            }

            const booked = company.booked_appointments
                .map((a: any) => JSON.parse(a))
                .filter((a: any) => a.appointmentDate === selectedDate)
                .map((a: any) => a.time);

            const interval = company.slot_interval;

            const available: string[] = [];
            let current = new Date(selectedDate + 'T' + schedule.start);
            const end = new Date(selectedDate + 'T' + schedule.end);

            while (current < end) {
                const timeStr = current.toTimeString().slice(0, 5);
                if (!booked.includes(timeStr)) {
                    available.push(timeStr);
                }
                current.setMinutes(current.getMinutes() + interval);
            }

            setAvailableTimes(available);
        } catch (error) {
            console.error(error);
            notify.error("אירעה שגיאה בטעינת הזמנים הפנויים");
        }
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
            await appointmentsService.bookAppointment(companyId, newAppointment);
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
                <select
                    name="time"
                    className="time"
                    value={formData.time}
                    onChange={handleChange}
                    required

                >
                    <option value="">בחר שעה</option>
                    {availableTimes.map((time, index) => (
                        <option key={index} value={time}>{time}</option>
                    ))}
                </select>
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
