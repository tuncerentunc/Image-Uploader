import React, { useState, useEffect } from "react";
import { storage, database } from "../firebase";
import { ref as dbRef, onValue } from "firebase/database";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { CircularProgress } from "@mui/material";
import initialFormState from "../variables/initialFormState";

type RenderDataProps = {
    getData: boolean;
    isUploading: boolean;
    setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
};

const RenderData: React.FC<RenderDataProps> = ({
    getData,
    isUploading,
    setIsUploading,
}) => {
    const [renderedImage, setRenderedImage] = useState("");
    const [imageInfo, setImageData] = useState({
        title: "New title",
        description: "Description",
    });

    console.log("rendered");

    useEffect(() => {
        getImageInfoFromDB();
        getImageFileFromStorage();
    }, [getData]);

    function getImageInfoFromDB() {
        onValue(dbRef(database, "imageInfo"), (snapshot) => {
            setImageData(snapshot.val());
        });
    }

    function getImageFileFromStorage() {
        listAll(ref(storage, "image/")).then((res) => {
            if (res.items.length > 0) {
                getDownloadURL(res.items[0])
                    .then((url) => {
                        setIsUploading(false);
                        setRenderedImage(url);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        });
    }

    return (
        <div className="layout-template">
            <p className="layout-template__title-badge">
                {imageInfo ? imageInfo.title : initialFormState.title}
            </p>
            <div className="render">
                <p className="render__title">
                    {imageInfo ? imageInfo.title : initialFormState.title}
                </p>
                <p className="render__description">
                    {imageInfo
                        ? imageInfo.description
                        : initialFormState.description}
                </p>

                {!isUploading ? (
                    <div
                        className="image-display"
                        style={{
                            backgroundImage: `url(${renderedImage})`,
                        }}></div>
                ) : (
                    <div className="loading">
                        <CircularProgress />
                        <p>Loading...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RenderData;
