import { Control, useWatch } from "react-hook-form";
import CardModel from "../models/cardModel";

interface ImageWatchedProps {
    control: Control<CardModel>;
    name: "coverImageFile" | "profileImageFile";
}

function ImageWatched({ control, name }: ImageWatchedProps) {
    const imageSrc = useWatch({
        control,
        name: name,
    });

    if (imageSrc) {
        const file = (imageSrc as unknown as FileList)[0];
        if (file) {
            const newSrc = window.URL.createObjectURL(file);
            return <img src={newSrc} alt="Image Preview" />;
        }
    }

    return null;
}


export default ImageWatched;