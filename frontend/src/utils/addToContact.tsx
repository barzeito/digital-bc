import React from "react";

interface AddToContactsButtonProps {
    user: {
        firstName: string;
        lastName: string;
        phone?: string;
        email?: string;
        company?: string;
    };
    themeColor?: string;
    textColor?: string;
}

const AddToContactsButton: React.FC<AddToContactsButtonProps> = ({ user, themeColor, textColor }) => {
    const downloadVCard = () => {
        const { firstName, lastName, phone, email, company } = user;

        if (!firstName || !lastName) {
            console.error("Missing essential user info!");
            return;
        }

        const vcardLines = [
            "BEGIN:VCARD",
            "VERSION:3.0",
            `N:${lastName};${firstName};;;`,
            `FN:${firstName} ${lastName}`,
            `ORG:${company || ""}`,
        ];

        if (phone) {
            vcardLines.push(`TEL;TYPE=CELL:${phone}`);
        }

        if (email) {
            vcardLines.push(`EMAIL:${email}`);
        }

        vcardLines.push("END:VCARD");

        const blob = new Blob([vcardLines.join("\n")], { type: "text/vcard" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${firstName}_${lastName}.vcf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };


    return (
        <button className="SaveContact" style={{ border: `1px solid ${themeColor}`, color: textColor }} onClick={downloadVCard}>שמירת איש קשר <i className="fa-solid fa-plus"></i></button>
    );
};

export default AddToContactsButton;