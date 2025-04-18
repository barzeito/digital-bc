import { useEffect, useState } from "react";
import CardModel from "../../../models/cardModel";
import "./CardDisplay.css";
import cardsService from "../../../services/cardsService";
import notify from "../../../services/popupMessage"
import { useNavigate, useParams } from "react-router-dom";
import noImage from "../../../assets/images/image-not-found.jpeg"
import profile from "../../../assets/images/profile.jpeg"
import facebookIcon from "../../../assets/socialMedia/facebook.png";
import instagramIcon from "../../../assets/socialMedia/instagram.png";
import linkedinIcon from "../../../assets/socialMedia/linkedin.png";
import twitterIcon from "../../../assets/socialMedia/twitter.png";
import whatsApp from "../../../assets/socialMedia/whatsapp.png";
import email from "../../../assets/socialMedia/mail.png";
import map from "../../../assets/socialMedia/map.png";
import phone from "../../../assets/socialMedia/telephone.png";
import tikTok from "../../../assets/socialMedia/tik-tok.png";
import socialService from "../../../services/socialService";
import SocialModel from "../../../models/socialModel";
import AddToContactsButton from "../../../utils/addToContact";


function CardDisplay(): JSX.Element {

    const { company } = useParams();
    const navigate = useNavigate();
    const [card, setCard] = useState<CardModel>();
    const [socialLinks, setSocialLinks] = useState<{ [key: string]: string }>({});

    const socialIcons: { [key: string]: string } = {
        facebook: facebookIcon,
        instagram: instagramIcon,
        linkedin: linkedinIcon,
        twitter: twitterIcon,
        whatsapp: whatsApp,
        email: email,
        map: map,
        phone: phone,
        tiktok: tikTok
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
                        console.log('Fetched card:', cardFromServer);
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
                    } else {
                        navigate("/");
                    }
                })
                .catch(error => notify.error(error));
        }
    }, [company, navigate]);

    return (
        <div className="CardDisplay">
            <div className="Card-Main">
                <div className="cd-Header">
                    <img className="cd-CoverImage" src={card?.coverImageUrl ? card.coverImageUrl : noImage}
                        alt="Cover"
                        onError={(e) => {
                            const image = e.target as HTMLImageElement;
                            image.src = noImage;
                        }}
                    />
                    <img className="cd-ProfileImage" src={profile} alt="Profile" />
                </div>
                <div className="cd-details">
                    <h2 className="cd-CompanyName">{card?.company}</h2>
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

                                return (
                                    <a
                                        key={platform}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-item"
                                    >
                                        <img src={socialIcons[platform]} alt={platform} />
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
                    <p>קצת עליי</p>
                    <span>{card?.about}</span>
                </div>
                <div className="cardDisplay-info">
                </div>
            </div>
        </div>
    );
}

export default CardDisplay;
