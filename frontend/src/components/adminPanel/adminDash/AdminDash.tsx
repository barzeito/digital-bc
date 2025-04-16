import AdminMenu from "../AdminMenu/AdminMenu";
import "./AdminDash.css";

function AdminPanel(): JSX.Element {
    return (
        <div className="AdminDash">
            <AdminMenu />
            
            <div className="dashboard-content">
                <section className="welcome">
                    <h1>שלום אדמין!</h1>
                    <p>הנה מה שקורה במערכת שלך כרגע:</p>
                </section>

                <section className="system-status">
                    <div className="status-card">
                        <h3>משתמשים רשומים</h3>
                        <p>124 משתמשים פעילים</p>
                    </div>
                    <div className="status-card">
                        <h3>כרטיסים פעילים</h3>
                        <p>86 כרטיסים פעילים</p>
                    </div>
                    <div className="status-card">
                        <h3>פניות אחרונות</h3>
                        <p>3 פניות חדשות</p>
                    </div>
                </section>

                <section className="quick-links">
                    <h2>מה אפשר לעשות?</h2>
                    <div className="link-card">
                        <button>ניהול משתמשים</button>
                    </div>
                    <div className="link-card">
                        <button>ניהול כרטיסים</button>
                    </div>
                    <div className="link-card">
                        <button>שליחת הודעה כללית</button>
                    </div>
                </section>

                <section className="system-info">
                    <h2>סטטוס מערכת</h2>
                    <p>✅ הכל תקין. אין בעיות כרגע.</p>
                    <p>🛠️ בקרוב: לוח ניתוחים וסטטיסטיקות שימוש.</p>
                </section>
            </div>
        </div>
    );
}

export default AdminPanel;
