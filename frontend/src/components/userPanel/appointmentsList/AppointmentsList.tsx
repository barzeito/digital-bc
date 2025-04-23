import { NavLink, useParams } from "react-router-dom";
import "./AppointmentsList.css";
import UserMenu from "../userMenu/UserMenu";
import { Appointment } from "../../../models/appointmentsModel";
import { useEffect, useState } from "react";
import appointmentsService from "../../../services/appointmentsService";
import notify from "../../../services/popupMessage";

function AppointmentList(): JSX.Element {
    const params = useParams();
    const companyId = String(params.id)
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        if (!companyId) return;
        loadAppointments();
    }, [companyId])

    const loadAppointments = async () => {
        try {
            const data = await appointmentsService.getOneByCompanyId(companyId);
            console.log("📦 תשובה מהשרת:", data);

            if (data) {
                const raw = data.booked_appointments;

                const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;

                // Convert each item from string to object if necessary
                const appointmentsArray: Appointment[] = parsed.map((item: any) => {
                    if (typeof item === "string") {
                        try {
                            return JSON.parse(item); // Convert JSON string to object
                        } catch (err) {
                            console.error("❌ לא ניתן לפענח את התור:", item, err);
                            return null;
                        }
                    }
                    return item;
                }).filter(Boolean); // Remove any null values

                console.log("📅 תורים לאחר עיבוד:", appointmentsArray);
                setAppointments(appointmentsArray);
            }
        } catch (error) {
            console.error("❌ שגיאה בטעינה:", error);
            notify.error("אירעה שגיאה בטעינת התורים");
        }
    };


    if (!appointments.length) {
        return <p>אין תורים פעילים</p>
    }
    return (
        <div className="AppointmentList">
            <UserMenu />
            <h2>תורים שנקבעו</h2>
            <ul>
                {appointments.map((app, index) => (
                    <li key={index}>
                        <strong>{app.name}</strong>
                        <div>{app.phone} </div>
                        <div>{app.date} </div>
                        <div> בשעה {app.time}</div>
                        {app.message && <div>הערה: {app.message}</div>}
                        <button>❌ מחק</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AppointmentList;
