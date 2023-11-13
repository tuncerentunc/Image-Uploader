import React, { useState, useEffect } from "react";
import { storage, database } from "../firebase";
import { ref as dbRef, onValue } from "firebase/database";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { CircularProgress, Tooltip } from "@mui/material";
import initialFormData from "../variables/variables";

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
    const [renderedImage, setRenderedImage] = useState(""); // image file url from firebase storage
    const [imageInfo, setImageData] = useState({
        title: "New title",
        description: "Description",
    }); // image info from firebase database

    console.log("rendered");

    useEffect(() => {
        getImageFileFromStorage();
        getImageInfoFromDB();
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
                        setIsUploading(false); // when false, loading icon and text is not rendered
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
                {/* { if page is refreshed during upload process image won't be upload properly to storage,
                 'imageInfo && renderedImage' conditions prevents rendering 'title' and 'description' without the image file} */}
                {imageInfo && renderedImage
                    ? imageInfo.title
                    : initialFormData.title}
            </p>
            <div className="render">
                {/* {if content overflows it can be read by hovering over the content and revealing the tooltips} */}
                <Tooltip
                    title={imageInfo && `${imageInfo.title}`}
                    arrow
                    placement="left">
                    <p className="render__title">
                        {imageInfo && renderedImage
                            ? imageInfo.title
                            : initialFormData.title}
                    </p>
                </Tooltip>

                <Tooltip
                    title={imageInfo && `${imageInfo.description}`}
                    arrow
                    placement="left">
                    <p className="render__description">
                        {imageInfo && renderedImage
                            ? imageInfo.description
                            : initialFormData.description}
                    </p>
                </Tooltip>

                {isUploading ? (
                    <div className="loading">
                        <CircularProgress />
                        <p>Loading...</p>
                    </div>
                ) : (
                    <div
                        className="image-display"
                        style={{
                            backgroundImage: `url(${renderedImage})`,
                        }}></div>
                )}
            </div>
        </div>
    );
};

export default RenderData;
