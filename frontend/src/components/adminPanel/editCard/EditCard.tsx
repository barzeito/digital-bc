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
    const user = useCurrentUser();

    const isAdmin = user?.roleId === 2;
    const uId = user?.userId;

    const { id, ownedBy } = useParams();
    const cardId = String(id);
    const userId = String(ownedBy);

    const navigate = useNavigate();

    const [coverSrc, setCoverSrc] = useState<string>('');
    const [profileSrc, setProfileSrc] = useState<string>('');
    const { handleSubmit, setValue, register, formState, control } = useForm<CardModel>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const [cardFromServer, socialFromServer] = await Promise.all([
                    cardsService.getOne(cardId),
                    socialService.getOneByCompanyId(cardId),
                ]);
                setValue('company', cardFromServer?.company);
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

                if (cardFromServer?.coverImageUrl) {
                    setCoverSrc(cardFromServer.coverImageUrl);
                }
                if (cardFromServer?.profileImageUrl) {
                    setProfileSrc(cardFromServer.profileImageUrl);
                }

                setValue("social.facebook", socialFromServer?.facebook || "");
                setValue("social.instagram", socialFromServer?.instagram || "");
                setValue("social.linkedin", socialFromServer?.linkedin || "");
                setValue("social.twitter", socialFromServer?.twitter || "");
                setValue("social.whatsapp", socialFromServer?.whatsapp || "");
                setValue("social.email", socialFromServer?.email || "");
                setValue("social.map", socialFromServer?.map || "");
                setValue("social.phone", socialFromServer?.phone || "");
                setValue("social.tiktok", socialFromServer?.tiktok || "");
            } catch (error) {
                console.log("Error loading card data: ", error)
                notify.error("שגיאה בטעינת נתונים");
            } finally {
                setLoading(false)
            }
        }

        fetchData();
    }, [cardId, userId, setValue]);

    async function submitCardUpdate(card: CardModel) {
        try {
            setLoading(true);
            card.coverImageFile = (card.coverImageFile as unknown as FileList)?.[0] || null;
            card.profileImageFile = (card.profileImageFile as unknown as FileList)?.[0] || null;

            if (card.coverImageFile === null) {
                card.coverImageFile = null
                card.coverImageUrl = null;
            }
            if (card.profileImageFile === null) {
                card.profileImageFile = null;
                card.profileImageUrl = null;
            }
            card.id = cardId;
            await cardsService.editCard(card);

            const social = new SocialModel();
            social.company_id = cardId;
            Object.assign(social, card.social);

            Object.entries(social).forEach(([key, value]) => {
                if (typeof value === "string" && value.trim() === "") {
                    (social as any)[key] = null;
                }
            });

            await socialService.editSocial(social);
            if (isAdmin) {
                navigate("/panel/admin/cards");
            } else {
                navigate(`/panel/user/${uId}`);
            }
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
                {loading ? (
                    <Loader />
                ) : (
                    <form onSubmit={handleSubmit(submitCardUpdate)}>
                        <div className="edit-row">
                            <div className="edit-group">
                                <label>שם החברה באנגלית (ישמש ככתובת הכרטיס):</label>
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
                                    <input
                                        type="file"
                                        accept="image/*"
                                        {...register('coverImageFile')}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setCoverSrc(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                    {coverSrc && (
                                        <div className="image-preview-wrapper">
                                            <img src={coverSrc} alt="Cover" className="preview-image" />
                                            <button
                                                type="button"
                                                className="delete-image-icon"
                                                title="מחק תמונת קאבר"
                                                onClick={() => {
                                                    setCoverSrc('');
                                                    setValue('coverImageFile', null);
                                                    setValue('coverImageUrl', null);
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="edit-group">
                                    <label>תמונת פרופיל:</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        {...register('profileImageFile')}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setProfileSrc(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                    {profileSrc && (
                                        <div className="image-preview-wrapper">
                                            <img src={profileSrc} alt="Profile" className="preview-image" />
                                            <button
                                                type="button"
                                                className="delete-image-icon"
                                                title="מחק תמונת פרופיל"
                                                onClick={() => {
                                                    setProfileSrc('');
                                                    setValue('profileImageFile', null);
                                                    setValue('profileImageUrl', null);
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="edit-row">
                            <div className="edit-group">
                                <label>קישור לפייסבוק:</label>
                                <input type="text" {...register("social.facebook")} />
                            </div>
                            <div className="edit-group">
                                <label>קישור לאינסטגרם:</label>
                                <input type="text" {...register("social.instagram")} />
                            </div>
                            <div className="edit-group">
                                <label>קישור ללינקדאין:</label>
                                <input type="text" {...register("social.linkedin")} />
                            </div>
                        </div>

                        <div className="edit-row">
                            <div className="edit-group">
                                <label>קישור לטוויטר:</label>
                                <input type="text" {...register("social.twitter")} />
                            </div>
                            <div className="edit-group">
                                <label>קישור לווטסאפ:</label>
                                <input type="text" {...register("social.whatsapp")} />
                            </div>
                            <div className="edit-group">
                                <label>קישור לטיקטוק:</label>
                                <input type="text" {...register("social.tiktok")} />
                            </div>
                        </div>

                        <div className="edit-row">
                            <div className="edit-group">
                                <label>כתובת לניווט:</label>
                                <input type="text" {...register("social.map")} />
                            </div>
                            <div className="edit-group">
                                <label>אימייל ליצירת קשר:</label>
                                <input type="text" {...register("social.email")} />
                            </div>
                            <div className="edit-group">
                                <label>טלפון ליצירת קשר:</label>
                                <input type="text" {...register("social.phone")} />
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
                                            <button className="submit-btn">שמירה</button>
                                            <NavLink to={`/panel/user/${uId}`} className="cancel-btn">ביטול</NavLink>
                                        </>
                                    )}
                                </>
                            ) : (
                                <Loader />
                            )}
                        </div>
                    </form>
                )}
            </DashboardLayout>
        </div >
    );
}

export default EditCard;
