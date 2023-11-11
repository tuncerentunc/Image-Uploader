import React from "react";
import { storage, database } from "../firebase";
import { ref as dbRef, onValue } from "firebase/database";
import { ref, listAll, getDownloadURL } from "firebase/storage";

type Props = {
    renderApp: boolean;
};

const RenderData: React.FC<Props> = ({ renderApp }) => {
    const [renderedImage, setRenderedImage] = React.useState("");
    const [imageData, setImageData] = React.useState({
        title: "New Title",
        description: "Description",
    });

    console.log("rendered");

    React.useEffect(() => {
        getImageInfoFromDB();
        getImageFileFromStorage();
    }, [renderApp]);

    function getImageInfoFromDB() {
        const imageDataRef = dbRef(database, "imageData");
        onValue(imageDataRef, (snapshot) => {
            const data = snapshot.val();
            setImageData(data);
        });
    }

    function getImageFileFromStorage() {
        const imageRef = ref(storage, "image/");
        listAll(imageRef).then((res) => {
            getDownloadURL(res.items[0])
                .then((url) => {
                    setRenderedImage(url);
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    }

    return (
        <div className="layout-template">
            <p className="layout-template__title-badge">{imageData.title}</p>
            <div className="render">
                <p className="render__title">{imageData.title}</p>
                <p className="render__description">{imageData.description}</p>

                <div
                    className="image-display"
                    style={{
                        backgroundImage: `url(${renderedImage})`,
                    }}></div>
            </div>
        </div>
    );
};

export { RenderData };
