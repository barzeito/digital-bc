import { useState } from "react";
import AuthMenu from "../auth/authMenu/AuthMenu";
import "./Home.css";
import socialService from "../../services/socialService";
import notify from "../../services/popupMessage";
import Loader from "../layout/loader/Loader";

function Home(): JSX.Element {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true)
            await socialService.sendContactEmail(formData.name, formData.email, formData.message);
            notify.success("ההודעה נשלחה בהצלחה!");
            setFormData({ name: "", email: "", message: "" });
        } catch {
            notify.error("אירעה שגיאה. נסה שוב.");
        } finally {
            setLoading(false)
        }
    };
    return (
        <div className="Home">
            <AuthMenu />
            <div className="HomePage" id="home-section">
                <section className="home-hero">
                    <div className="home-container">
                        <h1>הכרטיס הדיגיטלי שימקם את העסק שלך בחזית</h1>
                        <p>
                            תפסיק להתפשר על ייצוג עסקי. עם כרטיס דיגיטלי מותאם אישית, הלקוחות שלך יתחברו אליך מיידית.
                        </p>
                        <a href="#home-contact-form-section"> <button className="home-cta-button">צור קשר</button> </a>
                    </div>
                </section>

                <section className="home-about home-container" id="who-are-we">
                    <h2>מי אנחנו?</h2>
                    <p>
                        אנחנו צוות מומחים בשיווק דיגיטלי, עיצוב ופיתוח עם חזון אחד ברור: לאפשר לכל עסק, בכל גודל,
                        להיראות כמו מותג מוביל. בעידן שבו הרושם הראשוני קובע – אנחנו כאן כדי לוודא שאתה בולט,
                        מובן ונגיש ללקוחות שלך.
                    </p>
                    <p>
                        הכרטיס הדיגיטלי שפיתחנו הוא תוצאה של ניסיון, הבנה עמוקה של צרכי עסקים קטנים, ורצון לתת כלי
                        אפקטיבי, פשוט לשימוש, ומקצועי – בלי כאב ראש ובלי עלויות מיותרות.
                    </p>
                </section>
                <section className="home-how-it-works home-container">
                    <h2>איך זה עובד?</h2>
                    <div className="home-steps">
                        <div className="home-step">
                            <h3>1. יוצרים קשר</h3>
                            <p>יוצרים קשר דרך טופס יצירת הקשר, ונציג יחזור אלייך בהקדם.</p>
                        </div>
                        <div className="home-step">
                            <h3>2. בונים את הכרטיס</h3>
                            <p>עורך פשוט ונוח מאפשר לך להוסיף לוגו, צבעים, טקסטים וקישורים משלך.</p>
                        </div>
                        <div className="home-step">
                            <h3>3. משתפים את העולם</h3>
                            <p>בלחיצת כפתור אתה יכול לשלוח את הכרטיס לוואטסאפ, מייל, QR ועוד.</p>
                        </div>
                    </div>
                </section>

                <section className="home-who-is-it-for home-container" id="services">
                    <h2>למי זה מתאים?</h2>
                    <p>
                        הכרטיס הדיגיטלי מתאים לעצמאים, עסקים קטנים, נותני שירותים, מטפלים, מאמנים,
                        יועצים, ובעלי חנויות. בקיצור – לכל מי שרוצה שלקוחות ימצאו אותו בקלות ויראו
                        תדמית מרשימה.
                    </p>
                    <p>
                        לא צריך אתר יקר או כרטיס נייר מיושן. הכרטיס שלנו נגיש מכל מכשיר, נראה מצוין,
                        וכולל את כל מה שצריך במקום אחד.
                    </p>
                </section>

                <section className="home-features">
                    <div className="home-container">
                        <h2>מה הכרטיס כולל?</h2>
                        <ul className="home-features-list">
                            <li>✔ פרטי קשר מלאים עם קישורים ישירים</li>
                            <li>✔ לינקים לרשתות חברתיות</li>
                            <li>✔ תיאורים, תמונות, לוגו וסרטונים</li>
                            <li>✔ טופס יצירת קשר ישיר</li>
                            <li>✔ אזור להזמנת פגישה דרך יומן</li>
                            <li>✔ התאמה אישית מלאה של צבעים וסגנון</li>
                        </ul>
                    </div>
                </section>

                <section className="home-faq container">
                    <h2>שאלות נפוצות</h2>
                    <div className="home-faq-item">
                        <h4>האם אפשר לעדכן את הכרטיס אחרי שהוא מוכן?</h4>
                        <p>בוודאי. כל אחד מהשדות ניתן לעריכה בכל שלב, דרך הדשבורד שלך.</p>
                    </div>
                    <div className="home-faq-item">
                        <h4>האם הכרטיס מתאים גם לעסקים קטנים?</h4>
                        <p>כן. במיוחד להם – הוא חוסך עשרות אלפי שקלים על אתר, גרפיקה, ניהול פניות ועוד.</p>
                    </div>
                    <div className="home-faq-item">
                        <h4>כמה זמן לוקח לבנות את הכרטיס?</h4>
                        <p>פחות מ-10 דקות! ממשק הבנייה פשוט, קליל, וכולל תצוגה מקדימה בזמן אמת.</p>
                    </div>
                </section>

                <section className="home-final-cta container">
                    <h2>רוצה להתחיל להיראות כמו עסק אמיתי?</h2>
                    <p>
                        אל תחכה – העולם עובר לדיגיטל. תן לנו לעזור לך להפוך את העסק שלך לנגיש, מרשים, ומקצועי תוך דקות.
                    </p>
                    <a href="#home-contact-form-section"> <button className="home-cta-button">התחל עכשיו</button></a>
                </section>

                <section className="home-contact-form-section" id="home-contact-form-section">
                    <div className="home-container">
                        <h2>צור קשר</h2>
                        <form onSubmit={handleContactSubmit} className="home-contact-form">
                            <input
                                type="text"
                                name="name"
                                placeholder="שם מלא"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="אימייל"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <textarea
                                name="message"
                                placeholder="ההודעה שלך"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            />
                            {!loading ? (
                                <>
                                    <button type="submit" className="home-cta-button">שלח</button>
                                </>
                            ) : (
                                <Loader />
                            )}
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Home;