import "./AppointmentsForm.css";

function AppointmentsForm(): JSX.Element {
    return (
        <div className="AppointmentsForm">
            <form>
                <h3>Appointment Schedule</h3>

                <div>
                    <label>Start Time</label>
                    <input type="time" />
                </div>

                <div>
                    <label>End Time</label>
                    <input type="time" />
                </div>

                <div>
                    <label>Slot Interval (minutes)</label>
                    <input type="number" min="1" max="60" />
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default AppointmentsForm;
