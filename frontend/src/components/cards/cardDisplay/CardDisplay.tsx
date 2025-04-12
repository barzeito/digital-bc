import { useEffect, useState } from "react";
import CardModel from "../../../models/cardModel";
import "./CardDisplay.css";
import cardsService from "../../../services/cardsService";
import notify from "../../../services/Notify";
import { useNavigate, useParams } from "react-router-dom";
import banner from "../../../assets/images/banner.jpeg"
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




function CardDisplay(): JSX.Element {

    const { company } = useParams();
    const navigate = useNavigate();
    const [card, setCard] = useState<CardModel>();

    useEffect(() => {
        if (company) {
            cardsService.getByName(company)
                .then(cardFromServer => {
                    if (cardFromServer) {
                        setCard(cardFromServer)
                    } else {
                        navigate("/")
                    }
                })
                .catch(error => notify.error(error))
        }
    }, [company, navigate])

    return (
        <div className="CardDisplay">
            <div className="Card-Main">
                <div className="cd-Header">
                    <img className="cd-CoverImage" src={banner} alt="Banner Image" />
                    <img className="cd-ProfileImage" src={profile} alt="Profile Image" />
                </div>
                <div className="cd-details">
                    <h2 className="cd-CompanyName">{card?.company}</h2>
                    <p className="cd-CompanyDesc">{card?.description}</p>
                </div>
                <div className="cd-body">
                    <div className="cd-social">
                        <div className="social-item">
                            <img src={facebookIcon} alt="Facebook" />
                            <p>פייסבוק</p>
                        </div>
                        <div className="social-item">
                            <img src={instagramIcon} alt="Instagram" />
                            <p>אינסטגרם</p>
                        </div>
                        <div className="social-item">
                            <img src={linkedinIcon} alt="LinkedIn" />
                            <p>לינקדאין</p>
                        </div>
                        <div className="social-item">
                            <img src={twitterIcon} alt="Twitter" />
                            <p>טוויטר</p>
                        </div>
                        <div className="social-item">
                            <img src={whatsApp} alt="WhatsApp" />
                            <p>וואטסאפ</p>
                        </div>
                        <div className="social-item">
                            <img src={email} alt="Email" />
                            <p>אימייל</p>
                        </div>
                        <div className="social-item">
                            <img src={map} alt="Map" />
                            <p>נווט</p>
                        </div>
                        <div className="social-item">
                            <img src={phone} alt="Phone" />
                            <p>טלפון</p>
                        </div>
                        <div className="social-item">
                            <img src={tikTok} alt="TikTok" />
                            <p>טיק טוק</p>
                        </div>
                    </div>
                    <div className="cd-SaveContact">
                        <button className="SaveContact">שמירת איש קשר <i className="fa-solid fa-plus"></i></button>
                    </div>
                    <div className="cardDisplay-info">
                        <p><strong>Email:</strong> {card?.email}</p>
                        <p><strong>Phone:</strong> {card?.phone}</p>
                        <p><strong>Website:</strong> <a href={card?.website} target="_blank" rel="noopener noreferrer">{card?.website}</a></p>
                        <p><strong>Address:</strong> {card?.address}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CardDisplay;
