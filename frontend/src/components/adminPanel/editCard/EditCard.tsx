import { NavLink, useNavigate, useParams } from "react-router-dom";
import "./EditCard.css";
import { useEffect, useState } from "react";
import cardsService from "../../../services/cardsService";
import { useForm } from "react-hook-form";
import CardModel from "../../../models/cardModel";
import notify from "../../../services/popupMessage"
import socialService from "../../../services/socialService";
import SocialModel from "../../../models/socialModel";
import ImageWatched from "../../../utils/imageWatch"
import Loader from "../../layout/loader/Loader";
import DashboardLayout from "../dashboardLayout/DashboardLayout";
import useCurrentUser from "../../../utils/useCurrentUser";

function EditCard(): JSX.Element {

    const params = useParams();
    const cardId = String(params.id);
    const socialCompanyId = String(params.id);
    const navigate = useNavigate();

    const user = useCurrentUser();
    const isAdmin = user?.roleId === 2;

    const uId = user?.userId;

    const [coverSrc, setCoverSrc] = useState<string>('');
    const [profileSrc, setProfileSrc] = useState<string>('');
    const { handleSubmit, setValue, register, formState, control } = useForm<CardModel>();
    const [selectedSocial, setSelectedSocial] = useState<string>("");
    const [socialLinks, setSocialLinks] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        cardsService.getOne(cardId)
            .then(cardFromServer => {
                setValue('company', cardFromServer?.company);
                setCoverSrc(cardFromServer?.coverImageUrl || '');
                setProfileSrc(cardFromServer?.profileImageUrl || '');
                setValue('name', cardFromServer?.name);
                setValue('description', cardFromServer?.description);
                setValue('about', cardFromServer?.about);
                setValue('email', cardFromServer?.email);
                setValue('address', cardFromServer?.address);
                setValue('phone', cardFromServer?.phone);
                setValue('website', cardFromServer?.website);
                setValue('themeColor', cardFromServer?.themeColor);
                setValue('backgroundColor', cardFromServer?.backgroundColor);
                setValue('textColor', cardFromServer?.textColor);

            })
            .catch(error => notify.error(error))
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
            if (card.coverImageFile === null) {
                card.coverImageUrl = null;
            }
            if (card.profileImageFile === null) {
                card.profileImageUrl = null;
            }
            card.id = cardId;
            console.log(card)
            await cardsService.editCard(card);

            const social = new SocialModel();
            social.company_id = socialCompanyId;

            if (selectedSocial && socialLinks[selectedSocial]) {
                social[selectedSocial as keyof SocialModel] = socialLinks[selectedSocial];
            }

            await socialService.editSocial(social);
            navigate("/panel/admin/cards")
            notify.success('!כרטיס עודכן בהצלחה');
        } catch (error) {
            console.error(error);
            notify.error('.אירעה שגיאה בעת עדכון הכרטיס, אנא נסה שוב');
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="EditCard">
            <DashboardLayout>
                <h2>עריכת כרטיס</h2>
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
                            <label>צבע נושא:</label>
                            <input type="color" {...register('themeColor')} defaultValue="#2C2D33" />
                            <span className="error">{formState.errors.themeColor?.message}</span>
                        </div>

                        <div className="edit-group">
                            <label>צבע רקע:</label>
                            <select {...register('backgroundColor')}>
                                <option value="#424242">שחור</option>
                                <option value="#F8F9FD">לבן</option>
                            </select>
                            <span className="error">{formState.errors.backgroundColor?.message}</span>
                        </div>
                        <div className="edit-group">
                            <label>צבע טקסט:</label>
                            <select {...register('textColor')}>
                                <option value="#2C2D33">שחור</option>
                                <option value="#F4F5F6">לבן</option>
                            </select>
                            <span className="error">{formState.errors.textColor?.message}</span>
                        </div>
                    </div>
                    <div className="edit-row">
                        <div className="pc-images">
                            <div className="edit-group">
                                <label>תמונת קאבר:</label>
                                <input type="file" accept="image/*" {...register('coverImageFile', {
                                })} /><span>{formState.errors.coverImageFile?.message}</span>

                                <ImageWatched control={control} name="coverImageFile" defaultSrc={coverSrc} />
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
                    <div className="edit-buttons">
                        {!loading ? (
                            <>
                                {isAdmin ? (
                                    <>
                                        <button className="submit-btn">שמירה</button>
                                        <NavLink to="/panel/admin/cards" className="cancel-btn">ביטול</NavLink>
                                    </>
                                ) : (
                                    <>
                                        <NavLink to={`/panel/user/${uId}`} className="submit-btn">שמירה</NavLink>
                                        <NavLink to={`/panel/user/${uId}`} className="cancel-btn">ביטול</NavLink>
                                    </>
                                )}
                            </>
                        ) : (
                            <Loader />
                        )}
                    </div>
                </form>
            </DashboardLayout>
        </div >
    );
}

export default EditCard;
