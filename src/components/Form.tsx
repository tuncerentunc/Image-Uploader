import React, { useState } from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { storage, database } from "../firebase";
import { ref as dbRef, set } from "firebase/database";

import {
    ref,
    uploadBytes,
    deleteObject,
    StorageReference,
} from "firebase/storage";

type FormProps = {
    setgetData: React.Dispatch<React.SetStateAction<boolean>>;
    setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
};

type FormState = {
    title: string;
    description: string;
    imageFile?: Blob;
};

const initialState = {
    title: "New title",
    description: "Description",
    imageFile: undefined,
};

const Form: React.FC<FormProps> = ({ setgetData, setIsUploading }) => {
    const [imageUrl, setImageUrl] = useState<string>("");
    const [formData, setFormData] = useState<FormState>(initialState);

    React.useEffect(() => {
        if (formData.imageFile) {
            setImageUrl(URL.createObjectURL(formData.imageFile));
        }
    }, [formData.imageFile]);

    function handleChange(
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) {
        const { name, value } = event.target;

        const imageFile = (event.target as HTMLInputElement).files;

        setFormData({
            ...formData,
            [name]: name === "imageFile" && imageFile ? imageFile[0] : value,
        });
    }

    function handleSubmit() {
        setIsUploading(true);
        uploadImageFileToStorage();
        uploadImageInfoToDB();
        setFormData(initialState);
        setImageUrl("");
    }

    function uploadImageFileToStorage() {
        if (formData.imageFile) {
            const imageRef = ref(storage, "image/UploadedImage");
            // this doesn' work, i still get error when there is no file
            if (imageRef) {
                deleteImageFromStorage(imageRef);
            }

            uploadBytes(imageRef, formData.imageFile).then(() => {
                setgetData((prev) => !prev);
            });
        }
    }

    function deleteImageFromStorage(imageRef: StorageReference) {
        deleteObject(imageRef)
            .then(() => {
                // File deleted successfully
            })
            .catch(() => {
                console.log("Something went wrong");
            });
    }

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
                        {!imageUrl && (
                            <>
                                <AddIcon
                                    sx={{
                                        position: "absolute",
                                        top: "40%",
                                        right: "50%",
                                        fontSize: "6rem",
                                        transform: "translate(50%, -50%)",
                                    }}
                                />
                                <p className="form__label-text">Add Image</p>
                            </>
                        )}
                    </div>

                    <input
                        id="imageFile"
                        className="form__image"
                        name="imageFile"
                        type="file"
                        accept="image/png, image/jpg"
                        onChange={handleChange}
                    />
                </label>

                <Button
                    color="success"
                    variant="contained"
                    disableElevation
                    disabled={Object.values(formData).some((value) => !value)}
                    onClick={handleSubmit}
                    endIcon={<FileUploadIcon />}>
                    UPLOAD
                </Button>
            </form>
        </div>
    );
};

export default Form;
