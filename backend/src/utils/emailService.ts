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
        from: '"WJS Innovations" <dbc@gmail.com>',
        to: email,
        subject: "ברוך הבא! הפרטים שלך למערכת",
        html: `
        <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto;">
            <h2 style="color: #333;">שלום ${firstName},</h2>
            
            <p style="font-size: 16px; color: #444;">
                ברוך הבא למערכת <strong>WJS Innovations</strong>!
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
                צוות <strong>WJS Innovations</strong>
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
    const mailOptions = {
        from: '"WJS Innovations" <dbc@gmail.com>',
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
                    צוות <strong>WJS Innovations</strong>
                </p>
            </div>
        `
    };


    await transporter.sendMail(mailOptions);
};

export const sendAppointmentConfirmationEmail = async (
    email: string,
    firstName: string,
    appointmentDate: string,
    appointmentTime: string,
    phone: string,
    message?: string
) => {
    const mailOptions = {
        from: '"WJS Innovations" <dbc@gmail.com>',
        to: email,
        subject: "אישור קביעת תור - WJS Innovations",
        html: `
        <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto;">
            <h2 style="color: #333;">שלום ${firstName},</h2>
            
            <p style="font-size: 16px; color: #444;">
                תורך נקבע בהצלחה במערכת <strong>WJS Innovations</strong>!
            </p>
        
            <p style="font-size: 16px; color: #444;">
                להלן פרטי התור שלך:
            </p>
        
            <ul style="font-size: 16px; color: #444; list-style-type: none; padding: 0;">
                <li><strong>תאריך התור:</strong> ${appointmentDate}</li>
                <li><strong>שעת התור:</strong> ${appointmentTime}</li>
                <li><strong>טלפון:</strong> ${phone}</li>
                ${message ? `<li><strong>הודעה:</strong> ${message}</li>` : ''}
            </ul>
        
            <p style="font-size: 16px; color: #d9534f; margin-top: 10px;">
                ⚠️ אם יש שינויים בתור או אם ברצונך לבטל, אנא פנה אלינו בהקדם.
            </p>
        
            <p style="font-size: 14px; color: #888;">
                אם אינך מזהה הודעה זו, אנא התעלם ממנה או פנה לתמיכה.
            </p>
        
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
            <p style="font-size: 14px; color: #666;">
                בברכה,<br>
                צוות <strong>WJS Innovations</strong>
            </p>
        </div>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent successfully to :${email}`);
    } catch (error) {
        console.error("❌ Error sending appointment confirmation email", error);
    }
};


export const sendAppointmentToCompanyEmail = async (
    companyEmail: string,
    customerName: string,
    appointmentDate: string,
    appointmentTime: string,
    phone: string,
    message?: string
) => {
    const mailOptions = {
        from: '"WJS Innovations" <dbc@gmail.com>',
        to: companyEmail,
        subject: "תור חדש נקבע - WJS Innovations",
        html: `
        <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto;">
            <h2 style="color: #333;">שלום,</h2>
            
            <p style="font-size: 16px; color: #444;">
                לקוח חדש קבע תור במערכת <strong>WJS Innovations</strong>.
            </p>
        
            <p style="font-size: 16px; color: #444;">
                להלן פרטי התור החדש:
            </p>
        
            <ul style="font-size: 16px; color: #444; list-style-type: none; padding: 0;">
                <li><strong>שם הלקוח:</strong> ${customerName}</li>
                <li><strong>תאריך התור:</strong> ${appointmentDate}</li>
                <li><strong>שעת התור:</strong> ${appointmentTime}</li>
                <li><strong>טלפון:</strong> ${phone}</li>
                ${message ? `<li><strong>הודעה מהלקוח:</strong> ${message}</li>` : ''}
            </ul>
        
            <p style="font-size: 16px; color: #d9534f; margin-top: 10px;">
                ⚠️ אנא וודא שהתור נקבע ומוכן.
            </p>
        
            <div style="text-align: center; margin: 30px 0;">
                <a href="${config.get("app.email_service.domain")}" 
                   style="background-color: #007bff; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 16px; display: inline-block;">
                  ניהול התור שלך
                </a>
            </div>
        
            <p style="font-size: 14px; color: #888;">
                אם אינך מזהה הודעה זו, אנא התעלם ממנה או פנה לתמיכה.
            </p>
        
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
            <p style="font-size: 14px; color: #666;">
                בברכה,<br>
                צוות <strong>WJS Innovations</strong>
            </p>
        </div>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent successfully to company: ${companyEmail}`);
    } catch (error) {
        console.error("❌ Error sending appointment email to company", error);
    }
};

export const sendContactEmail = async (
    adminEmail: string,
    fullName: string,
    senderEmail: string,
    subject: string,
    message: string
) => {
    const mailOptions = {
        from: `"WJS Innovations" <dbc@gmail.com>`,
        to: adminEmail,
        subject: `פנייה חדשה - ${subject}`,
        html: `
        <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto;">
            <h2 style="color: #333;">פנייה חדשה מהאתר</h2>
            
            <p style="font-size: 16px; color: #444;">
                התקבלה פנייה חדשה מטופס צור קשר באתר <strong>WJS Innovations</strong>.
            </p>
        
            <ul style="font-size: 16px; color: #444; list-style-type: none; padding: 0;">
                <li><strong>שם מלא:</strong> ${fullName}</li>
                <li><strong>אימייל:</strong> ${senderEmail}</li>
                <li><strong>נושא הפנייה:</strong> ${subject}</li>
            </ul>
        
            <p style="font-size: 16px; color: #444; margin-top: 20px;">
                <strong>הודעה:</strong><br>
                ${message.replace(/\n/g, "<br>")}
            </p>
        
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
            <p style="font-size: 14px; color: #666;">
                בברכה,<br>
                מערכת <strong>WJS Innovations</strong>
            </p>
        </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Contact email sent successfully from ${senderEmail}`);
    } catch (error) {
        console.error("❌ Error sending contact email", error);
    }
};
