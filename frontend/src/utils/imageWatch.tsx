import { Control, UseFormSetValue, useWatch } from "react-hook-form";
import CardModel from "../models/cardModel";
import "./ImageWatched.css";
import { useState, useEffect } from "react";
import notify from "../services/popupMessage";
import Loader from "../components/layout/loader/Loader";

interface ImageWatchedProps {
    control: Control<CardModel>;
    name: "coverImageFile" | "profileImageFile";
    defaultSrc?: string;
    setValue?: UseFormSetValue<CardModel>;
}

function ImageWatched({ control, name, defaultSrc, setValue }: ImageWatchedProps): JSX.Element | null {
    const [isDeleted, setIsDeleted] = useState(false);
    const imageSrc = useWatch({ control, name });
    const [isLoading, setIsLoading] = useState(true);

    const handleDelete = () => {
        setIsDeleted(true);
        // Set the file to null
        setValue?.(name, null);

        // Also clear the URL field when deleting an image
        if (name === "coverImageFile") {
            setValue?.("coverImageUrl", undefined);
        } else if (name === "profileImageFile") {
            setValue?.("profileImageUrl", undefined);
        }
    };

    useEffect(() => {
        if (isDeleted) {
            notify.info("התמונה נמחקה");
        }
    }, [isDeleted]);

    useEffect(() => {
        if (imageSrc || defaultSrc) {
            setIsLoading(false);
        }
    }, [imageSrc, defaultSrc]);

    if (isDeleted) return null;

    if (isLoading) {
        return <Loader />;
    }

    if (imageSrc) {
        const file = (imageSrc as unknown as FileList)[0];
        if (file) {
            const newSrc = window.URL.createObjectURL(file);
            return (
                <div className="image-container">
                    <img src={newSrc} alt="Preview" />
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
                <img src={defaultSrc} alt="Existing" />
                <button type="button" className="deleteImage-btn" onClick={handleDelete}>
                    &#10005;
                </button>
            </div>
        );
    }

    return null;
}

export default ImageWatched;
