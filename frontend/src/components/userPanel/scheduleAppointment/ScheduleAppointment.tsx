import { useEffect, useState } from "react";
import "./ScheduleAppointment.css";
import notify from "../../../services/popupMessage";
import appointmentsService from "../../../services/appointmentsService";
import { useForm } from "react-hook-form";
import cardsService from "../../../services/cardsService";

interface FormData {
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    message: string;
}

function ScheduleAppointment({ companyId }: { companyId: string }): JSX.Element {
    const [colors, setColors] = useState({ backgroundColor: '', themeColor: '', textColor: '' });

    useEffect(() => {
        if (companyId) {
            cardsService.getColors(companyId).then((data) => {
                if (data) {
                    setColors({
                        backgroundColor: data?.backgroundColor || '',
                        themeColor: data?.themeColor || '',
                        textColor: data?.textColor || ''
                    });
                } else {
                    setColors({
                        backgroundColor: '',
                        themeColor: '',
                        textColor: ''
                    });
                }
            });
        }
    }, [companyId])

    const [availableTimes, setAvailableTimes] = useState<string[]>([]);

    const { register, handleSubmit, reset } = useForm<FormData>();

    const fetchAppointmentTimes = async (selectedDate: string) => {
        try {
            const { company, appointments } = await appointmentsService.getAvailableTimes(companyId, selectedDate);

            if (!company?.days_schedule) {
                setAvailableTimes([]);
                return;
            }

            const dayName = new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                timeZone: "Asia/Jerusalem",
            }).toLowerCase();

            const schedule = company.days_schedule[dayName];

            if (!schedule) {
                setAvailableTimes([]);
                return;
            }

            const bookedTimes = appointments
                .filter((a: any) => new Date(a.date).toISOString().split('T')[0] === new Date(selectedDate).toISOString().split('T')[0])
                .map((a: any) => a.time.slice(0, 5));

            const interval = company.slot_interval || 30;
            const available: string[] = [];

            let current = new Date(`${selectedDate}T${schedule.start}`);
            const end = new Date(`${selectedDate}T${schedule.end}`);

            while (current < end) {
                const timeStr = current.toTimeString().slice(0, 5);
                if (!bookedTimes.includes(timeStr)) {
                    available.push(timeStr);
                }
                current.setMinutes(current.getMinutes() + interval);
            }

            setAvailableTimes(available);
        } catch (error) {
            console.error("Error loading available appointments: ", error);
            notify.error("אירעה שגיאה בטעינת הזמנים הפנויים");
        }
    };



    const submitBookAppointment = async (data: FormData) => {
        if (!data.name || !data.phone || !data.date || !data.time) {
            notify.error("אנא מלא את כל השדות הנדרשים");
            return;
        }

        const newAppointment = {
            company_id: companyId,
            name: data.name,
            email: data.email,
            phone: data.phone,
            date: data.date,
            time: data.time,
            message: data.message,
        };

        try {
            await appointmentsService.bookNewAppointment(newAppointment);
            notify.success("התור הוזמן בהצלחה!");
            reset();
        } catch (error) {
            console.log("Error book appointment: ", error)
            notify.error("אירעה שגיאה בהזמנת התור");
        }
    };

    return (
        <div className="ScheduleAppointment">
            <p style={{ color: `${colors.themeColor}` }}>הזמנת תור</p>
            <form className="sa-form" onSubmit={handleSubmit(submitBookAppointment)} style={{ backgroundColor: `${colors.backgroundColor}` }}>
                <label style={{ color: `${colors.textColor}` }}>שם</label>
                <input
                    type="text"
                    {...register("name", { required: true })}
                    placeholder="שם מלא"
                />
                <label style={{ color: `${colors.textColor}` }}>אימייל</label>
                <input
                    type="email"
                    {...register("email")}
                    placeholder="דואר אלקטרוני"
                />
                <label style={{ color: `${colors.textColor}` }}>טלפון</label>
                <input
                    type="tel"
                    {...register("phone", { required: true })}
                    placeholder="מספר טלפון"
                />
                <label style={{ color: `${colors.textColor}` }}>תאריך</label>
                <input
                    type="date"
                    {...register("date", { required: true })}
                    onChange={(e) => fetchAppointmentTimes(e.target.value)}
                />
                <label style={{ color: `${colors.textColor}` }}>שעה</label>
                <select
                    {...register("time", { required: true })}
                >
                    <option value="">בחר שעה</option>
                    {availableTimes.map((time, index) => (
                        <option key={index} value={time}>{time}</option>
                    ))}
                </select>
                <label style={{ color: `${colors.textColor}` }}>הערות</label>
                <textarea
                    {...register("message")}
                    placeholder="הזן הערות"
                />
                <button type="submit" className="submit-btn" style={{ color: `${colors.themeColor}`, border: `1px solid ${colors.themeColor}` }}>הזמן תור</button>
            </form>
        </div>
    );
}

export default ScheduleAppointment;
