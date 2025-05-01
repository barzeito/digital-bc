import { useEffect, useState } from "react";
import CardModel from "../../../models/cardModel";
import "./CardDisplay.css";
import cardsService from "../../../services/cardsService";
import { useNavigate, useParams } from "react-router-dom";
import noImage from "../../../assets/images/image-not-found.jpeg"
import { ReactComponent as facebookIcon } from "../../../assets/socialMedia/icons8-facebook.svg";
import { ReactComponent as instagramIcon } from "../../../assets/socialMedia/icons8-instagram.svg";
import { ReactComponent as linkedinIcon } from "../../../assets/socialMedia/icons8-linkedin.svg";
import { ReactComponent as twitterIcon } from "../../../assets/socialMedia/icons8-x.svg";
import { ReactComponent as whatsApp } from "../../../assets/socialMedia/icons8-whatsapp.svg";
// import email from "../../../assets/socialMedia/mail.png";
// import map from "../../../assets/socialMedia/map.png";
// import phone from "../../../assets/socialMedia/telephone.png";
import { ReactComponent as tikTok } from "../../../assets/socialMedia/icons8-tiktok.svg";
import socialService from "../../../services/socialService";
import SocialModel from "../../../models/socialModel";
import AddToContactsButton from "../../../utils/addToContact";
import ScheduleAppointment from "../../userPanel/ScheduleAppointment/ScheduleAppointment";
import appointmentsService from "../../../services/appointmentsService";


function CardDisplay(): JSX.Element {

    const { company } = useParams();
    const navigate = useNavigate();
    const [card, setCard] = useState<CardModel>();
    const [appAvailable, setAppAvailable] = useState<boolean>(false);
    const [companyId, setCompanyId] = useState<string>();
    const [socialLinks, setSocialLinks] = useState<{ [key: string]: string }>({});
    const [colors, setColors] = useState({ backgroundColor: '', themeColor: '', textColor: '' });

    const socialIcons: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
        facebook: facebookIcon,
        instagram: instagramIcon,
        linkedin: linkedinIcon,
        twitter: twitterIcon,
        whatsapp: whatsApp,
        tikTok: tikTok,
    };

    const socialLabels: { [key: string]: string } = {
        facebook: "פייסבוק",
        instagram: "אינסטגרם",
        linkedin: "לינקדאין",
        twitter: "טוויטר",
        whatsapp: "וואטסאפ",
        email: "אימייל",
        map: "נווט",
        phone: "טלפון",
        tiktok: "טיקטוק"
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
            <div className="Card-Main" style={{ backgroundColor: `${colors.backgroundColor}`, color: `${colors.textColor}` }}>
                <div className="cd-Header">
                    <img className="cd-CoverImage" src={card?.coverImageUrl ? card.coverImageUrl : noImage}
                        alt="Cover"
                        onError={(e) => {
                            const image = e.target as HTMLImageElement;
                            image.src = noImage;
                        }}
                    />
                    <img className="cd-ProfileImage" src={card?.profileImageUrl ? card.profileImageUrl : noImage}
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
                            {Object.keys(socialIcons).map((platform) => {
                                if (!socialLinks[platform]) return null;

                                const href = socialLinks[platform].startsWith("http")
                                    ? socialLinks[platform]
                                    : "https://" + socialLinks[platform];

                                const IconComponent = socialIcons[platform];

                                return (
                                    <a
                                        key={platform}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-item"
                                    >
                                        <IconComponent className="social-icon" style={{ fill: `${colors.themeColor}` }} />
                                        <p>{socialLabels[platform]}</p>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                    <div className="cd-SaveContact">
                        <AddToContactsButton user={{
                            firstName: card?.firstName || "",
                            lastName: card?.lastName || "",
                            phone: card?.phone || "",
                            email: card?.email || "",
                            company: card?.company || ""
                        }} />
                    </div>
                </div>
                <div className="cd-About">
                    <p style={{ color: `${colors.themeColor}` }}>קצת עליי</p>
                    <span>{card?.about}</span>
                </div>
                <div className="cardDisplay-info">
                </div>
                {appAvailable && card?.id && (
                    <ScheduleAppointment companyId={card.id} />
                )}
            </div>
        </div >
    );
}

export default CardDisplay;
