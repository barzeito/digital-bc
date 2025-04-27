import { useNavigate, useParams } from "react-router-dom";
import "./UserCardEdit.css";
import { useForm } from "react-hook-form";
import CardModel from "../../../models/cardModel";
import { useEffect, useState } from "react";
import cardsService from "../../../services/cardsService";
import notify from "../../../services/popupMessage"
import { NavLink } from "react-router-dom";
import UserMenu from "../userMenu/UserMenu";
import SocialModel from "../../../models/socialModel";
import socialService from "../../../services/socialService";
import ImageWatched from "../../../utils/imageWatch";
import { useCurrentUser } from "../../../utils/useCurrentUser";
import Loader from "../../layout/loader/Loader";

function UserCardEdit(): JSX.Element {
    const params = useParams();
    const cardId = String(params.id);
    const user = useCurrentUser();
    const userId = user?.userId;
    const socialCompanyId = String(params.id)
    const navigate = useNavigate();
    const [selectedSocial, setSelectedSocial] = useState<string>("");
    const [socialLinks, setSocialLinks] = useState<{ [key: string]: string }>({});

    const [coverSrc, setCoverSrc] = useState<string>('');
    const [profileSrc, setProfileSrc] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const { handleSubmit, setValue, register, formState, control } = useForm<CardModel>();

    useEffect(() => {
        console.log("Loading new card with ID:", cardId);
        cardsService.getOne(cardId)
            .then(cardFromServer => {
                console.log("Loaded card:", cardFromServer);
                setValue('company', cardFromServer?.company);
                setValue('name', cardFromServer?.name);
                setValue('description', cardFromServer?.description);
                setValue('about', cardFromServer?.about);
                setValue('email', cardFromServer?.email);
                setValue('address', cardFromServer?.address);
                setValue('phone', cardFromServer?.phone);
                setValue('website', cardFromServer?.website);

                setCoverSrc(cardFromServer?.coverImageUrl || '');
                setProfileSrc(cardFromServer?.profileImageUrl || '');
            })
            .catch(error => notify.error(error));
    }, [cardId, setValue]);


    const handleSocialLinkChange = (platform: string, value: string) => {
        setSocialLinks(prevLinks => ({
            ...prevLinks,
            [platform]: value,
        }));
    };

    async function submitCardUpdate(card: CardModel) {
        try {
            setLoading(true);
            card.coverImageFile = (card.coverImageFile as unknown as FileList)?.[0] || null;
            card.profileImageFile = (card.profileImageFile as unknown as FileList)?.[0] || null;

            // Explicitly set image URLs to null if they were deleted
            if (card.coverImageUrl === null) {
                card.coverImageUrl = undefined; // This will tell the backend to remove the cover image
            }
            if (card.profileImageUrl === null) {
                card.profileImageUrl = undefined; // This will tell the backend to remove the profile image
            }

            card.id = cardId;
            await cardsService.editCard(card);

            const social = new SocialModel();
            social.company_id = socialCompanyId;

            if (selectedSocial && socialLinks[selectedSocial]) {
                social[selectedSocial as keyof SocialModel] = socialLinks[selectedSocial];
            }

            await socialService.editSocial(social);
            navigate(`/panel/user/${userId}`)
            notify.success('!הכרטיס עודכן בהצלחה');
        } catch (error) {
            console.error(error);
            notify.error('Failed to update card and social links');
        } finally {
            setLoading(false);
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
                    <div className="pc-images">
                        <div className="edit-group">
                            <label>תמונת קאבר:</label>
                            <input type="file" accept="image/*" {...register('coverImageFile', {
                            })} /><span>{formState.errors.coverImageFile?.message}</span>

                            <ImageWatched control={control} name="coverImageFile" defaultSrc={coverSrc} setValue={setValue} />
                        </div>
                        <div className="edit-group">
                            <label>תמונת פרופיל:</label>
                            <input type="file" accept="image/*" {...register('profileImageFile', {
                            })} /><span>{formState.errors.profileImageFile?.message}</span>

                            <ImageWatched control={control} name="profileImageFile" defaultSrc={profileSrc} />
                        </div>
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
                    {!loading ? (
                        <>
                            <button className="submit-btn">שמירה</button>
                            <NavLink to={`/panel/user/${userId}`} className="cancel-btn">ביטול</NavLink>
                        </>
                    ) : (
                        <Loader />
                    )}
                </div>

            </form>
        </div>
    );
}

export default UserCardEdit;
