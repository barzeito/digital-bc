import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useParams } from "react-router-dom";
import appointmentsService from "../../../services/appointmentsService";
import notify from "../../../services/popupMessage";
import AppointmentsModel from "../../../models/appointmentsModel";
import "./AppointmentsForm.css";
import UserMenu from "../userMenu/UserMenu";

const daysMap: Record<string, string> = {
    sunday: "ראשון",
    monday: "שני",
    tuesday: "שלישי",
    wednesday: "רביעי",
    thursday: "חמישי",
    friday: "שישי",
    saturday: "שבת"
};

function AppointmentForm(): JSX.Element {
    const params = useParams();
    const companyId = String(params.id);
    const uId = String(params.userId);
    const { handleSubmit, register, formState } = useForm<AppointmentsModel>();
    const [appointmentData, setAppointmentData] = useState<AppointmentsModel | null>(null);

    const [daysSchedule, setDaysSchedule] = useState<Record<string, { start: string; end: string }>>(
        Object.fromEntries(Object.keys(daysMap).map(day => [day, { start: "", end: "" }]))
    );



    useEffect(() => {
        const fetchAppointmentData = async () => {
            try {
                const data = await appointmentsService.getOneByCompanyId(companyId);
                if (data) {
                    setAppointmentData(data);

                    if (data.days_schedule) {
                        setDaysSchedule(prevState => ({
                            ...prevState,
                            ...data.days_schedule
                        }));
                    }
                }
            } catch (error) {
                notify.error(".קבלת נתונים נכשלה, אנא נסה שוב מאוחר יותר");
            }
        };

        fetchAppointmentData();
    }, [companyId]);


    const onSubmit = async (data: Partial<AppointmentsModel>) => {
        try {
            const cleanedSchedule = Object.fromEntries(
                Object.entries(daysSchedule).filter(([_, val]) =>
                    val.start?.trim() && val.end?.trim()
                )
            );

            if (appointmentData) {
                const updatedData: AppointmentsModel = {
                    appId: appointmentData.appId,
                    company_id: companyId,
                    company: appointmentData.company || "",
                    days_schedule: cleanedSchedule,
                    slot_interval: Number(data.slot_interval),
                };
                await appointmentsService.editApps(updatedData);
                notify.success("!זמינות עודכנה בהצלחה")
            } else {
                const newData: Partial<AppointmentsModel> = {
                    company_id: companyId,
                    company: data.company || "",
                    days_schedule: cleanedSchedule,
                    slot_interval: Number(data.slot_interval),
                };
                notify.success("!זמינות עודכנה בהצלחה")
                await appointmentsService.add(newData);
            }
        } catch (error: any) {
            const message = error.response?.data.message || error?.message ||
                'שגיאה כללית בעת שמירת זמינות';
            notify.error(message);
        }
    };

    return (
        <div className="AppointmentForm">
            <UserMenu />
            <div className="optionsButtons">
            <NavLink to={`/appointments/${companyId}/${uId}`} className="activeApps">תורים פעילים</NavLink>
            </div>
            <div className="appOptions">
                <h2>הגדרת זמני הזמינות</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="hidden" {...register("company_id")} value={companyId} />
                    <input type="hidden" {...register("company")} />

                    <h3>שעות פעילות</h3>
                    {Object.entries(daysMap).map(([dayKey, hebrewDay]) => (
                        <div key={dayKey} className="day-row">
                            <label>{hebrewDay}</label>
                            <div className="time-range">
                                <span>פתיחה: </span>
                                <input
                                    type="time"
                                    value={daysSchedule[dayKey]?.start || ""}
                                    onChange={(e) =>
                                        setDaysSchedule((prev) => ({
                                            ...prev,
                                            [dayKey]: {
                                                ...prev[dayKey],
                                                start: e.target.value,
                                            },
                                        }))
                                    }
                                />
                                <span> סגירה: </span>
                                <input
                                    type="time"
                                    value={daysSchedule[dayKey]?.end || ""}
                                    onChange={(e) =>
                                        setDaysSchedule((prev) => ({
                                            ...prev,
                                            [dayKey]: {
                                                ...prev[dayKey],
                                                end: e.target.value,
                                            },
                                        }))
                                    }
                                />
                            </div>
                        </div>
                    ))}

                    <div className="form-group">
                        <label>משך כל פגישה: </label>
                        <select
                            {...register("slot_interval", { required: "שדה חובה!" })}
                            defaultValue=""
                        >
                            <option value="">בחר משך פגישה</option>
                            {[5, 10, 15, 20, 25, 30, 45, 60].map((v) => (
                                <option key={v} value={v}>
                                    {v} דקות
                                </option>
                            ))}
                        </select>
                        <span className="error">{formState.errors.slot_interval?.message}</span>
                    </div>

                    <div className="buttons">
                        <button className="submit-btn">שמירה</button>
                        <NavLink to={`/panel/user/${uId}`} className="cancel-btn">ביטול</NavLink>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AppointmentForm;
