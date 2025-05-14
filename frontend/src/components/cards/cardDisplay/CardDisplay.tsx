import { useEffect, useState } from "react";
import CardModel from "../../../models/cardModel";
import "./CardDisplay.css";
import cardsService from "../../../services/cardsService";
import { useNavigate, useParams } from "react-router-dom";
import noImage from "../../../assets/images/image-not-found-new.png"
import { ReactComponent as facebookIcon } from "../../../assets/socialMedia/icons8-facebook.svg";
import { ReactComponent as instagramIcon } from "../../../assets/socialMedia/icons8-instagram.svg";
import { ReactComponent as linkedinIcon } from "../../../assets/socialMedia/icons8-linkedin.svg";
import { ReactComponent as twitterIcon } from "../../../assets/socialMedia/icons8-x.svg";
import { ReactComponent as whatsApp } from "../../../assets/socialMedia/icons8-whatsapp.svg";
import { ReactComponent as email } from "../../../assets/socialMedia/email-svgrepo-com.svg";
import { ReactComponent as MapIcon } from "../../../assets/socialMedia/icons8-waze.svg";
import { ReactComponent as phone } from "../../../assets/socialMedia/icons8-phone.svg";
import { ReactComponent as tiktok } from "../../../assets/socialMedia/icons8-tiktok.svg";
import socialService from "../../../services/socialService";
import SocialModel from "../../../models/socialModel";
import AddToContactsButton from "../../../utils/addToContact";
import ScheduleAppointment from "../../userPanel/ScheduleAppointment/ScheduleAppointment";
import appointmentsService from "../../../services/appointmentsService";
import { QRCodeSVG } from "qrcode.react";

function CardDisplay(): JSX.Element {

    const { company } = useParams();
    const navigate = useNavigate();
    const [card, setCard] = useState<CardModel>();
    const [appAvailable, setAppAvailable] = useState<boolean>(false);
    const [companyId, setCompanyId] = useState<string>();
    const [socialLinks, setSocialLinks] = useState<{ [key: string]: string }>({});
    const [colors, setColors] = useState({ backgroundColor: '', themeColor: '', textColor: '' });
    const [isMapPopupOpen, setIsMapPopupOpen] = useState(false);

    const socialIcons: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
        facebook: facebookIcon,
        instagram: instagramIcon,
        linkedin: linkedinIcon,
        twitter: twitterIcon,
        whatsapp: whatsApp,
        tiktok: tiktok,
        phone: phone,
        email: email,
    };

    const socialLabels: { [key: string]: string } = {
        facebook: "פייסבוק",
        instagram: "אינסטגרם",
        linkedin: "לינקדאין",
        twitter: "טוויטר",
        whatsapp: "וואטסאפ",
        tiktok: "טיקטוק",
        email: "אימייל",
        map: "נווט",
        phone: "טלפון"
    };

    const handleWhatsAppShare = () => {
        const url = getQRCodeUrl();
        const text = `היי, אני חושב שזה יעניין אותך: כרטיס ביקור דיגיטלי של ${card?.name} - ${url}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
    };

    // Share via Email
    const handleEmailShare = () => {
        const url = getQRCodeUrl();
        const subject = `כרטיס ביקור דיגיטלי - ${card?.name}`;
        const body = `היי,\n\nרציתי לשתף איתך את כרטיס הביקור הדיגיטלי של ${card?.name}.\n\nקישור לכרטיס: ${url}\n\nבברכה,`;
        const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoUrl, '_blank');
    };


    const renderSocialLink = (platform: string) => {
        const value = socialLinks[platform];
        if (!value) return null;

        if (platform === "map") {
            return (
                <button
                    key="map"
                    className="social-item"
                    onClick={() => setIsMapPopupOpen(true)}
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                    <MapIcon className="social-icon" style={{ fill: colors.themeColor }} />
                    <p style={{ color: colors.textColor }}>{socialLabels["map"]}</p>
                </button>
            );
        }

        const IconComponent = socialIcons[platform];
        if (!IconComponent) return null;

        // קביעת href לפי סוג
        let href = value;
        if (platform === "phone") {
            href = `tel:${value}`;
        } else if (platform === "email") {
            href = `mailto:${value}`;
        } else if (!value.startsWith("http")) {
            href = `https://${value}`;
        }

        return (
            <a
                key={platform}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-item"
            >
                <IconComponent className="social-icon" style={{ fill: colors.themeColor }} />
                <p style={{ color: colors.textColor }}>{socialLabels[platform]}</p>
            </a>
        );
    };

    const getQRCodeUrl = () => {
        const domain = window.location.origin;
        return `${domain}/cards/${card?.company}`;
    };

    useEffect(() => {
        if (company) {
            cardsService.getByName(company)
                .then(async cardFromServer => {
                    if (cardFromServer) {
                        setCard(cardFromServer);
                        const allSocials: SocialModel[] = await socialService.getAll();
                        const filtered = allSocials.filter(s => s.company_id === cardFromServer.id);
                        const socialMap: { [key: string]: string } = {};
                        filtered.forEach(s => {
                            if (s.facebook) socialMap["facebook"] = s.facebook;
                            if (s.instagram) socialMap["instagram"] = s.instagram;
                            if (s.linkedin) socialMap["linkedin"] = s.linkedin;
                            if (s.twitter) socialMap["twitter"] = s.twitter;
                            if (s.whatsapp) socialMap["whatsapp"] = s.whatsapp;
                            if (s.email) socialMap["email"] = s.email;
                            if (s.map) socialMap["map"] = s.map;
                            if (s.phone) socialMap["phone"] = s.phone;
                            if (s.tiktok) socialMap["tiktok"] = s.tiktok;
                        });
                        setSocialLinks(socialMap);
                        setCompanyId(cardFromServer.id);
                    } else {
                        navigate("/");
                    }
                })
                .catch(Error);
        }
    }, [company, navigate]);

    useEffect(() => {
        const fetchAvailability = async () => {
            if (!companyId) return;
            try {
                const app = await appointmentsService.getAppAvailable(companyId);
                setAppAvailable(app);
            } catch (error) {
                console.log(error);
            }
        };

        fetchAvailability();
    }, [companyId]);

    useEffect(() => {
        if (companyId) {
            cardsService.getColors(companyId).then((data) => {
                if (data) {
                    setColors({
                        backgroundColor: data?.backgroundColor || '',
                        themeColor: data?.themeColor || '',
                        textColor: data?.textColor || ''
                    });
                } else {
                    setColors({
                        backgroundColor: '',
                        themeColor: '',
                        textColor: ''
                    });
                }
            });
        }
    }, [companyId])

    return (
        <div className="CardDisplay">
            <div
                className="Card-Main"
                style={{
                    backgroundColor: colors.backgroundColor,
                    color: colors.textColor,
                }}
            >
                <div className="cd-Header">
                    <img
                        className="cd-CoverImage"
                        src={card?.coverImageUrl || noImage}
                        alt="Cover"
                        onError={(e) => {
                            const image = e.target as HTMLImageElement;
                            image.src = noImage;
                        }}
                    />
                    <img
                        className="cd-ProfileImage"
                        src={card?.profileImageUrl || noImage}
                        alt="Profile"
                        onError={(e) => {
                            const image = e.target as HTMLImageElement;
                            image.src = noImage;
                        }}
                    />
                </div>

                <div className="cd-details">
                    <h2 className="cd-CompanyName">{card?.name}</h2>
                    <p className="cd-CompanyDesc">{card?.description}</p>
                </div>

                <div className="cd-body">
                    <div className="cd-social">
                        <div className="cd-item">
                            {Object.keys(socialLinks).map((platform) =>
                                renderSocialLink(platform)
                            )}
                        </div>
                    </div>
                </div>

                <div className="cd-SaveContact">
                    <AddToContactsButton
                        user={{
                            firstName: card?.name?.split(" ")[0] || "",
                            lastName: card?.name?.split(" ")[1] || "",
                            phone: socialLinks?.phone ?? "",
                            email: socialLinks?.email ?? "",
                            company: card?.company || "",
                        }}
                        themeColor={colors.themeColor}
                        textColor={colors.textColor}
                    />
                </div>

                <div className="cd-About">
                    <p style={{ color: colors.themeColor }}>קצת עליי</p>
                    <span>{card?.about}</span>
                </div>

                <div className="cardDisplay-info"></div>

                {appAvailable && card?.id && (
                    <ScheduleAppointment companyId={card.id} />
                )}

                <div className="cd-share">
                    <div className="cd-QRCode">
                        {card && (
                            <div className="qrcode-container">
                                <h3 style={{ color: colors.themeColor }}>סרוק לשיתוף כרטיס הביקור</h3>
                                <QRCodeSVG
                                    value={getQRCodeUrl()}
                                    size={150}
                                    bgColor={"#ffffff"}
                                    fgColor={colors.themeColor || "#000000"}
                                    level={"H"}
                                    includeMargin={true}
                                />
                            </div>
                        )}
                    </div>
                </div>
                {/* Map Popup */}
                {isMapPopupOpen && (
                    <div className="mapPopup" onClick={() => setIsMapPopupOpen(false)}>
                        <div
                            className="mapPopup-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3>כתובת העסק</h3>
                            <p>{socialLinks["map"]}</p>
                            <a
                                href={`https://maps.google.com/?q=${encodeURIComponent(
                                    socialLinks["map"]
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                פתיחה במפה
                            </a>
                            <button onClick={() => setIsMapPopupOpen(false)}>סגור</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

}

export default CardDisplay;
