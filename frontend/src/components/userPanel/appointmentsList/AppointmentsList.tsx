import { useParams } from "react-router-dom";
import "./AppointmentsList.css";
import UserMenu from "../userMenu/UserMenu";
import { Appointment } from "../../../models/appointmentsModel";
import { useEffect, useState } from "react";
import appointmentsService from "../../../services/appointmentsService";
import notify from "../../../services/popupMessage";
import formatDate from "../../../utils/formateDate";
import DashboardLayout from "../../adminPanel/dashboardLayout/DashboardLayout";

function AppointmentList(): JSX.Element {
    const params = useParams();
    const companyId = String(params.id);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);

    useEffect(() => {
        if (!companyId) return;

        const loadAppointments = async () => {
            try {
                const apps = await appointmentsService.getAllByCompanyId(companyId);
                setAppointments(apps);
            } catch (error) {
                console.error("❌ שגיאה בטעינה:", error);
                notify.error("אירעה שגיאה בטעינת התורים");
            }
        };

        loadAppointments();
    }, [companyId]);

    async function deleteAppointment(id: number): Promise<void> {
        try {
            await appointmentsService.deleteAppointment(id);
            notify.success("!התור נמחק בהצלחה");
            setAppointments((prev) => prev.filter(app => app.id !== id));
        } catch (error) {
            notify.error(".אירעה שגיאה בעת מחיקת התור, אנא נסה שוב");
        }
        setSelectedAppointmentId(null);
    }

    if (!appointments.length) {
        return <p>אין תורים פעילים</p>;
    }

    return (
        <div className="AppointmentList">
            <DashboardLayout>
                <h2>תורים שנקבעו</h2>
                <ul>
                    {appointments.map((app) => (
                        <li key={app.id}>
                            <strong>שם: {app.name}</strong>
                            <div>מספר טלפון: {app.phone}</div>
                            <div>בתאריך: {app.date && formatDate(app.date)}</div>
                            <div>בשעה: {app.time}</div>
                            {app.message && <div>הערה: {app.message}</div>}
                            <div className="app-btns">
                                <button className="submit-btn">ערוך תור</button>
                                <button className="cancel-btn" onClick={() => setSelectedAppointmentId(app.id)}>מחק תור</button>
                            </div>

                            {selectedAppointmentId === app.id && (
                                <div className="PopUpContainer">
                                    <div className="DeleteContainer">
                                        <div className="Delete-PopUp">
                                            <span>מוחק את התור</span>
                                            <p>האם אתה בטוח שברצונך למחוק את התור?</p>
                                            <div className="delete-buttons">
                                                <button onClick={() => deleteAppointment(app.id)} className="submit-btn">מחיקה</button>
                                                <button className="cancel-btn" onClick={() => setSelectedAppointmentId(null)}>ביטול</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </DashboardLayout>
        </div>
    );
}

export default AppointmentList;
