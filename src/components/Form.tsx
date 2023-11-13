import React, { useState } from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { storage, database } from "../firebase";
import { ref as dbRef, set } from "firebase/database";
import initialFormData from "../variables/variables";

import {
    ref,
    uploadBytes,
    deleteObject,
    StorageReference,
} from "firebase/storage";

type FormProps = {
    setgetData: React.Dispatch<React.SetStateAction<boolean>>;
    setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
    isUploading: boolean;
};

type initialFormData = {
    title: string;
    description: string;
    imageFile?: Blob;
};

const Form: React.FC<FormProps> = ({
    setgetData,
    isUploading,
    setIsUploading,
}) => {
    const [imageUrl, setImageUrl] = useState<string>(""); // to display locally uploaded image
    const [formData, setFormData] = useState<initialFormData>(initialFormData);

    // creates url from locally uploaded image file
    React.useEffect(() => {
        if (formData.imageFile) {
            setImageUrl(URL.createObjectURL(formData.imageFile));
        }
    }, [formData.imageFile]);

    // updates formData state
    function handleChange(
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) {
        const { name, value } = event.target;
        const imageFile = (event.target as HTMLInputElement).files;

        setFormData((prev) => {
            return {
                ...prev,
                [name]:
                    name === "imageFile" && imageFile ? imageFile[0] : value,
            };
        });
    }

    function handleSubmit() {
        setIsUploading(true); // when true, loading icon and text is rendered
        uploadImageFileToStorage();
        uploadImageInfoToDB();
        setFormData(initialFormData);
        setImageUrl("");
    }

    // uploads the local image file to firebase storage
    function uploadImageFileToStorage() {
        if (formData.imageFile) {
            const imageRef = ref(storage, "image/UploadedImage");

            // deletes the old one and then uploads the new image
            deleteImageFromStorage(imageRef);
            uploadBytes(imageRef, formData.imageFile).then(() => {
                setgetData((prev) => !prev);
            });
        }
    }

    function deleteImageFromStorage(imageRef: StorageReference) {
        deleteObject(imageRef).catch(() => {
            console.log("Something went wrong, can't delete file");
        });
    }

    // saves the title and description to firebase database
    function uploadImageInfoToDB() {
        const imageInfoRef = dbRef(database, "imageInfo/");
        set(imageInfoRef, formData);
    }

    return (
        <div className="layout-template">
            <p className="layout-template__title-badge">New Title</p>

            <form className="form" onSubmit={(e) => e.preventDefault()}>
                <textarea
                    className="form__title"
                    placeholder="New Title"
                    name="title"
                    onChange={handleChange}
                    value={formData.title}
                />

                <textarea
                    className="form__description"
                    placeholder="Description"
                    name="description"
                    onChange={handleChange}
                    value={formData.description}
                />

                <label className="form__label" htmlFor="imageFile">
                    <div
                        className="image-display"
                        style={{ backgroundImage: `url('${imageUrl}')` }}>
                        {
                            // if image is uploaded locally plus icon and text is not rendered
                            !imageUrl && (
                                <>
                                    <AddIcon sx={{ fontSize: "6rem" }} />
                                    <p className="form__label-text">
                                        Add Image
                                    </p>
                                </>
                            )
                        }
                    </div>

                    <input
                        id="imageFile"
                        className="form__image"
                        name="imageFile"
                        type="file"
                        accept="image/png, image/jpg"
                        // value is needed, otherwise uploading files with the same name won't trigger formData.imageFile dependency
                        value=""
                        onChange={handleChange}
                    />
                </label>

                <Button
                    sx={{ borderRadius: "0" }}
                    color="success"
                    variant="contained"
                    disableElevation
                    disabled={
                        // submit button is disabled when an upload is progress -to prevent 2 uploads at same time-,
                        //  or when one of the fields is empty.
                        Object.values(formData).some((value) => !value) ||
                        isUploading
                    }
                    onClick={handleSubmit}
                    endIcon={<FileUploadIcon />}>
                    UPLOAD
                </Button>
            </form>
        </div>
    );
};

export default Form;
