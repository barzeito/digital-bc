import { useNavigate, useParams } from "react-router-dom";
import "./AppointmentsList.css";
import { Appointment } from "../../../models/appointmentsModel";
import { useEffect, useState } from "react";
import appointmentsService from "../../../services/appointmentsService";
import notify from "../../../services/popupMessage";
import formatDate from "../../../utils/formateDate";
import DashboardLayout from "../../adminPanel/dashboardLayout/DashboardLayout";
import { useForm } from "react-hook-form";

function AppointmentList(): JSX.Element {
    const params = useParams();
    const navigate = useNavigate();
    const companyId = String(params.id);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
    const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
    const { register, handleSubmit, setValue, formState, reset } = useForm<Appointment>();

    useEffect(() => {
        if (!companyId) return;

        const loadAppointments = async () => {
            try {
                const apps = await appointmentsService.getAllByCompanyId(companyId);
                setAppointments(apps);
            } catch (error) {
                console.error("Error loading appointments: ", error);
                notify.error("אירעה שגיאה בטעינת התורים");
            }
        };

        loadAppointments();
    }, [companyId]);

    useEffect(() => {
        if (editingAppointment) {
            setValue("id", editingAppointment.id);
            setValue("name", editingAppointment.name);
            setValue("phone", editingAppointment.phone);
            setValue("date", editingAppointment.date.split("T")[0]);
            setValue("time", editingAppointment.time);
            setValue("message", editingAppointment.message || "");
        }
    }, [editingAppointment, setValue]);

    async function deleteAppointment(id: number): Promise<void> {
        try {
            await appointmentsService.deleteAppointment(id);
            notify.success("!התור נמחק בהצלחה");
            setAppointments((prev) => prev.filter(app => app.id !== id));
        } catch (error) {
            console.log("Error deleting appointment: ", error)
            notify.error(".אירעה שגיאה בעת מחיקת התור, אנא נסה שוב");
        }
        setSelectedAppointmentId(null);
    }

    async function submitAppointmentUpdate(app: Appointment) {
        try {
            app.id = Number(app.id)
            await appointmentsService.editAppointment(app);
            notify.success("התור עודכן בהצלחה!");
            const updated = await appointmentsService.getAllByCompanyId(companyId);
            setAppointments(updated);

            // סגירת הטופס
            setEditingAppointment(null);
        } catch (error: any) {
            notify.error(error);
            console.log(error)
        }
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
                                <button className="submit-btn" onClick={() => setEditingAppointment(app)}>ערוך תור</button>
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
                {editingAppointment && (
                    <div className="PopUpContainer">
                        <div className="EditContainer">
                            <form className="edit-appointment-form" onSubmit={handleSubmit(submitAppointmentUpdate)}>
                                <h3>עריכת תור</h3>

                                <div className="form-group">
                                    <label>שם מלא</label>
                                    <input type="text" {...register("name", { required: "שדה חובה" })} />
                                    <span className="error">{formState.errors.name?.message}</span>
                                </div>

                                <div className="form-group">
                                    <label>טלפון</label>
                                    <input type="tel" {...register("phone", { required: "שדה חובה" })} />
                                    <span className="error">{formState.errors.phone?.message}</span>
                                </div>

                                <div className="form-group">
                                    <label>תאריך</label>
                                    <input type="date" {...register("date", { required: "שדה חובה" })} />
                                    <span className="error">{formState.errors.date?.message}</span>
                                </div>

                                <div className="form-group">
                                    <label>שעה</label>
                                    <input type="time" {...register("time", { required: "שדה חובה" })} />
                                    <span className="error">{formState.errors.time?.message}</span>
                                </div>

                                <div className="form-group">
                                    <label>הערה</label>
                                    <textarea rows={3} {...register("message")} />
                                </div>

                                <div className="buttons">
                                    <button type="submit" className="submit-btn">שמירה</button>
                                    <button type="button" className="cancel-btn" onClick={() => setEditingAppointment(null)}>ביטול</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </DashboardLayout>
        </div>
    );
}

export default AppointmentList;
