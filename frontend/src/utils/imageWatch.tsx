import { Control, UseFormSetValue, useWatch } from "react-hook-form";
import CardModel from "../models/cardModel";
import "./ImageWatched.css";
import { useState, useEffect } from "react";
import notify from "../services/popupMessage";

interface ImageWatchedProps {
    control: Control<CardModel>;
    name: "coverImageFile" | "profileImageFile";
    defaultSrc?: string;
    setValue?: UseFormSetValue<CardModel>;
}

function ImageWatched({ control, name, defaultSrc, setValue }: ImageWatchedProps): JSX.Element | null {
    const [isDeleted, setIsDeleted] = useState(false);
    const imageSrc = useWatch({ control, name });

    const handleDelete = () => {
        setIsDeleted(true);
        setValue?.(name, undefined);
    };

    useEffect(() => {
        if (isDeleted) {
            notify.info("התמונה נמחקה");
        }
    }, [isDeleted]);

    if (isDeleted) return null;

    if (imageSrc) {
        const file = (imageSrc as unknown as FileList)[0];
        if (file) {
            const newSrc = window.URL.createObjectURL(file);
            return (
                <div className="image-container">
                    <img src={newSrc} alt="Image Preview" />
                    <button type="button" className="deleteImage-btn" onClick={handleDelete}>
                        &#10005;
                    </button>
                </div>
            );
        }
    }

    if (defaultSrc) {
        return (
            <div className="image-container">
                <img src={defaultSrc} alt="Existing Image" />
                <button type="button" className="deleteImage-btn" onClick={handleDelete}>
                    &#10005;
                </button>
            </div>
        );
    }

    return null;
}

export default ImageWatched;
