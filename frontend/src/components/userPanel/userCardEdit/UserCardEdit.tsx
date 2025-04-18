import { Navigate, useNavigate, useParams } from "react-router-dom";
import "./UserCardEdit.css";
import { useForm } from "react-hook-form";
import CardModel from "../../../models/cardModel";
import { useEffect, useState } from "react";
import cardsService from "../../../services/cardsService";
import notify from "../../../services/popupMessage"
import { authStore } from "../../../redux/authState";
import { jwtDecode } from "jwt-decode";
import { NavLink } from "react-router-dom";
import UserMenu from "../userMenu/UserMenu";
import SocialModel from "../../../models/socialModel";
import socialService from "../../../services/socialService";

function UserCardEdit(): JSX.Element {
    const params = useParams();
    const cardId = String(params.id);
    const uId = String(params.userId);
    const socialCompanyId = String(params.id)
    const navigate = useNavigate();
    const [isOwner, setIsOwner] = useState<boolean | null>(null);
    const [selectedSocial, setSelectedSocial] = useState<string>("");
    const [socialLinks, setSocialLinks] = useState<{ [key: string]: string }>({});
    const [userId, setUserId] = useState<string | null>(null);

    const { handleSubmit, setValue, register, formState } = useForm<CardModel>();

    useEffect(() => {
        const token = authStore.getState().token;

        if (token) {
            const decoded = jwtDecode<{ user: { userId: string } }>(token);
            const currentUserId = decoded.user.userId;
            setIsOwner(currentUserId === uId);
            setUserId(currentUserId)
        } else {
            setIsOwner(false);
        }

        const unsubscribe = authStore.subscribe(() => {
            const updatedToken = authStore.getState().token;
            if (updatedToken) {
                const updatedUserId = jwtDecode<{ user: { userId: string } }>(updatedToken).user.userId;
                setIsOwner(updatedUserId === uId);
            } else {
                setIsOwner(false);
            }
        });

        return unsubscribe;
    }, [uId]);

    useEffect(() => {
        cardsService.getOne(cardId)
            .then(cardFromServer => {
                setValue('company', cardFromServer?.company);
                setValue('name', cardFromServer?.name);
                setValue('description', cardFromServer?.description);
                setValue('about', cardFromServer?.about);
                setValue('email', cardFromServer?.email);
                setValue('address', cardFromServer?.address);
                setValue('phone', cardFromServer?.phone);
                setValue('website', cardFromServer?.website);
            })
            .catch(error => notify.error(error));
    }, [cardId, setValue]);

    if (isOwner === null) return <></>;

    if (!isOwner) return <Navigate to="/*" />;

    const handleSocialLinkChange = (platform: string, value: string) => {
        setSocialLinks(prevLinks => ({
            ...prevLinks,
            [platform]: value,
        }));
    };

    async function submitCardUpdate(card: CardModel) {
        try {
            card.id = cardId;
            await cardsService.editCard(card);

            const social = new SocialModel();
            social.company_id = socialCompanyId;

            if (selectedSocial && socialLinks[selectedSocial]) {
                social[selectedSocial as keyof SocialModel] = socialLinks[selectedSocial];
            }

            await socialService.editSocial(social);
            navigate(`/panel/user/${userId}`)
            notify.success('Card and Social Links Updated Successfully');
        } catch (error) {
            console.error(error);
            notify.error('Failed to update card and social links');
        }
    }

    return (
        <div className="UserCardEdit">
            <UserMenu />
            <h2>עריכת הכרטיס שלך</h2>
            <form onSubmit={handleSubmit(submitCardUpdate)}>
                <div className="edit-row">
                    <div className="edit-group">
                        <label>שם החברה:</label>
                        <input type="text" {...register('company', {
                            minLength: { value: 2, message: 'שם החברה חייב להיות מינימום 2 תווים.' },
                            required: { value: true, message: 'שדה חובה!' }
                        })} />
                        <span className="error">{formState.errors.company?.message}</span>
                    </div>

                    <div className="edit-group">
                        <label>שם:</label>
                        <input type="text" {...register('name', {
                            minLength: { value: 2, message: 'שם החברה חייב להיות מינימום 2 תווים.' },
                            required: { value: true, message: 'שדה חובה!' }
                        })} />
                        <span className="error">{formState.errors.name?.message}</span>
                    </div>

                    <div className="edit-group">
                        <label>תיאור החברה:</label>
                        <input type="text" {...register('description', {
                            minLength: { value: 2, message: 'תיאור החברה חייב להיות מינימום 2 תווים.' },
                            required: { value: true, message: 'שדה חובה!' }
                        })} />
                        <span className="error">{formState.errors.description?.message}</span>
                    </div>
                </div>
                <div className="edit-row">
                    <div className="edit-group">
                        <label>קצת על עצמי:</label>
                        <textarea {...register('about')} />
                        <span className="error">{formState.errors.about?.message}</span>
                    </div>
                </div>
                <div className="edit-row">
                    <div className="edit-group">
                        <label>אימייל:</label>
                        <input type="text" {...register('email', {
                            pattern: { value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, message: 'אימייל אינו תקין.' },
                            required: { value: true, message: 'שדה חובה!' }
                        })} />
                        <span className="error">{formState.errors.email?.message}</span>
                    </div>

                    <div className="edit-group">
                        <label>כתובת:</label>
                        <input type="text" {...register('address', {
                            minLength: { value: 4, message: 'כתובת חייבת להיות מינימום 4 תווים.' },
                            required: { value: true, message: 'שדה חובה!' }
                        })} />
                        <span className="error">{formState.errors.address?.message}</span>
                    </div>

                    <div className="edit-group">
                        <label>מספר טלפון:</label>
                        <input type="text" {...register('phone', {
                            pattern: { value: /^0\d{1,2}-?\d{7}$/, message: 'מספר טלפון אינו תקין.' },
                            required: { value: true, message: 'שדה חובה!' }
                        })} />
                        <span className="error">{formState.errors.phone?.message}</span>
                    </div>

                    <div className="edit-group">
                        <label>אתר אינטרנט:</label>
                        <input type="text" {...register('website', {
                            validate: (value) =>
                                !value || /^((https?:\/\/)?(www\.)?[\w-]+\.[a-z]{2,})(\/[\w._~:/?#[\]@!$&'()*+,;=-]*)?$/i.test(value)
                                || 'כתובת האתר אינה תקינה.'
                        })} />
                        <span className="error">{formState.errors.website?.message}</span>
                    </div>
                </div>
                <div className="edit-row">
                    <div className="edit-group">
                        <div className="social-media">
                            <label>רשת חברתית: </label>
                            <select
                                className="edit-social"
                                value={selectedSocial}
                                onChange={(e) => setSelectedSocial(e.target.value)}
                            >
                                <option value="" defaultValue={""}>בחר רשת חברתית</option>
                                <option value="facebook">פייסבוק</option>
                                <option value="instagram">אינסטגרם</option>
                                <option value="linkedin">לינקדאין</option>
                                <option value="twitter">טוויטר</option>
                                <option value="whatsapp">וואטסאפ</option>
                                <option value="email">אימייל</option>
                                <option value="map">נווט</option>
                                <option value="phone">טלפון</option>
                                <option value="tiktok">טיקטוק</option>
                            </select>
                        </div>
                        {selectedSocial && (
                            <div className="edit-group">
                                <label>קישור ל-{selectedSocial}:</label>
                                <input
                                    type="text"
                                    value={socialLinks[selectedSocial] || ""}
                                    onChange={(e) =>
                                        handleSocialLinkChange(selectedSocial, e.target.value)
                                    }
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="buttons">
                    <button className="submit-btn">שמירה</button>
                    <NavLink to={`/panel/user/${userId}`} className="cancel-btn">ביטול</NavLink>
                </div>
            </form>
        </div>
    );
}

export default UserCardEdit;
