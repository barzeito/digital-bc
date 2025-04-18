import nodemailer from "nodemailer";
import config from "config";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.get("app.email_service.email"),
        pass: config.get("app.email_service.app_password")
    }
});

export const sendWelcomeEmail = async (email: string, firstName: string, password: string) => {
    const mailOptions = {
        from: '"Digital Business Cards" <dbc@gmail.com>',
        to: email,
        subject: "ברוך הבא! הפרטים שלך למערכת",
        html: `
        <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto;">
            <h2 style="color: #333;">שלום ${firstName},</h2>
            
            <p style="font-size: 16px; color: #444;">
                ברוך הבא למערכת <strong>Digital Business Cards</strong>!
            </p>
        
            <p style="font-size: 16px; color: #444;">
                חשבונך נוצר בהצלחה. להלן פרטי הכניסה שלך:
            </p>
        
            <ul style="font-size: 16px; color: #444; list-style-type: none; padding: 0;">
                <li><strong>אימייל:</strong> ${email}</li>
                <li><strong>סיסמה זמנית:</strong> ${password}</li>
            </ul>
        
            <p style="font-size: 16px; color: #d9534f; margin-top: 10px;">
                ⚠️ אנא שנה את הסיסמה מיד לאחר הכניסה למערכת.
            </p>
        
            <div style="text-align: center; margin: 30px 0;">
                <a href="${config.get("app.email_service.domain")}" 
                   style="background-color: #007bff; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 16px; display: inline-block;">
                  התחבר עכשיו
                </a>
            </div>
        
            <p style="font-size: 14px; color: #888;">
                אם אינך מזהה הודעה זו, אנא התעלם ממנה או פנה לתמיכה.
            </p>
        
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
            <p style="font-size: 14px; color: #666;">
                בברכה,<br>
                צוות <strong>Digital Business Cards</strong>
            </p>
        </div>
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
        service: config.get("app.email_service.service"),
        auth: {
            user: config.get("app.email_service.email"),
            pass: config.get("app.email_service.app_password")
        }
    });

    const mailOptions = {
        from: '"Digital Business Cards" <dbc@gmail.com>',
        to: email,
        subject: "איפוס סיסמה",
        html: `
            <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto;">
                <h2 style="color: #333;">איפוס סיסמה</h2>
    
                <p style="font-size: 16px; color: #444;">
                    קיבלנו בקשה לאיפוס הסיסמה עבור חשבונך.
                </p>
    
                <p style="font-size: 16px; color: #444;">
                    לחץ על הכפתור הבא כדי לאפס את הסיסמה שלך:
                </p>
    
                <!-- Button styled as a table for better email compatibility -->
                <table role="presentation" align="center" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 30px 0;">
                    <tr>
                        <td align="center">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td align="center" bgcolor="#007bff" style="border-radius: 6px;">
                                        <a href="${resetLink}"
                                           target="_blank"
                                           style="border: solid 1px #007bff; border-radius: 6px; color: #FFFFFF; padding: 12px 24px; text-align: center; text-decoration: none; display: inline-block; font-family: sans-serif; font-size: 16px; font-weight: bold; line-height: 1.5em; cursor: pointer; mso-padding-alt: 0;">
                                            איפוס סיסמה
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
    
                <p style="font-size: 16px; color: #d9534f; margin-top: 10px;">
                    ⚠️ הלינק יהיה בתוקף ל-15 דקות בלבד.
                </p>
    
                <p style="font-size: 14px; color: #888;">
                    אם לא ביקשת לאפס את הסיסמה, אנא התעלם מהודעה זו.
                </p>
    
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
    
                <p style="font-size: 14px; color: #666;">
                    בברכה,<br>
                    צוות <strong>Digital Business Cards</strong>
                </p>
            </div>
        `
    };


    await transporter.sendMail(mailOptions);
};