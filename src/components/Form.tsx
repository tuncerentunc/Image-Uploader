import React from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { storage, database } from "../firebase";
import { ref as dbRef, set } from "firebase/database";

import {
    ref,
    uploadBytes,
    deleteObject,
    StorageReference,
} from "firebase/storage";

type FormProps = {
    setRenderApp: React.Dispatch<React.SetStateAction<boolean>>;
};

type FormState = {
    title: string;
    description: string;
    imageFile: Blob | null;
};

const Form: React.FC<FormProps> = ({ setRenderApp }) => {
    const [imageUrl, setImageUrl] = React.useState<string>("");
    const [formData, setFormData] = React.useState<FormState>({
        title: "New title",
        description: "New description",
        imageFile: null,
    });

    React.useEffect(() => {
        if (formData.imageFile) {
            setImageUrl(URL.createObjectURL(formData.imageFile));
        }
    }, [formData.imageFile]);

    function handleChange(
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) {
        const { name, value } = event.target;

        setFormData((prev) => {
            const imageFile = (event.target as HTMLInputElement).files;
            return name === "imageFile" && imageFile
                ? {
                      ...prev,
                      [name]: imageFile[0],
                  }
                : {
                      ...prev,
                      [name]: value,
                  };
        });
    }

    function handleSubmit() {
        uploadImageStorage();
        sendImageInfoDB();
        setFormData({
            title: "New title",
            description: "New description",
            imageFile: null,
        });
        setImageUrl("");
    }

    function uploadImageStorage() {
        if (formData.imageFile) {
            const imageRef = ref(storage, "image/UploadedImage");

            // this doesn' work, i still get error when there is no file
            if (imageRef) {
                deleteImageStorage(imageRef);
            }

            uploadBytes(imageRef, formData.imageFile).then(() => {
                console.log("Uploaded");
                setRenderApp((prev) => !prev);
            });
        }
    }

    function deleteImageStorage(imageRef: StorageReference) {
        deleteObject(imageRef)
            .then(() => {
                // File deleted successfully
            })
            .catch(() => {
                console.log("Something went wrong");
            });
    }

    function sendImageInfoDB() {
        const imageDataRef = dbRef(database, "imageData/");
        set(imageDataRef, formData);
    }

    console.log(formData);

    return (
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
                        <AddIcon
                            sx={{
                                position: "absolute",
                                top: "50%",
                                right: "50%",
                                fontSize: "6rem",
                                transform: "translate(50%, -50%)",
                            }}
                        />
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

            <Button variant="contained" onClick={handleSubmit}>
                SUBMIT
            </Button>
        </form>
    );
};

export { Form };
