import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "bar199234@gmail.com",
        pass: "pjrr vlbw njzj irms"       
    }
});

export const sendWelcomeEmail = async (email: string, firstName: string, password: string) => {
    const mailOptions = {
        from: '"Digital Business Cards" <dbc@gmail.com>',
        to: email,
        subject: "ברוך הבא! הפרטים שלך למערכת",
        html: `
            <h2>שלום ${firstName},</h2>
            <p>חשבונך נוצר בהצלחה! להלן הפרטים שלך:</p>
            <ul>
                <li><strong>אימייל:</strong> ${email}</li>
                <li><strong>סיסמה זמנית:</strong> <strong>${password}</strong></li>
            </ul>
            <p>אנא שנה את הסיסמה מיד לאחר ההתחברות.</p>
            <p><a href="https://example.com/login">התחבר עכשיו</a></p>
            <br>
            <p>בברכה,<br> צוות Digital Business Cards</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`📧Email sent successfully to :${email}`);
    } catch (error) {
        console.error("❌ Error sending an email", error);
    }
};

export const sendResetEmail = async (email: string, resetLink: string) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "bar199234@gmail.com",  
            pass: "pjrr vlbw njzj irms"
        }
    });

    const mailOptions = {
        from: '"Digital Business Cards" <dbc@gmail.com>',
        to: email,
        subject: "איפוס סיסמה",
        html: `<p>לחץ על הקישור הבא כדי לאפס את הסיסמה שלך:</p>
               <a href="${resetLink}">${resetLink}</a>
               <p>הלינק יהיה בתוקף ל-15 דקות בלבד.</p>`
    };

    await transporter.sendMail(mailOptions);
};