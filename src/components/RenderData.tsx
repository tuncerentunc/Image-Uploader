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
        title: "neww",
        description: "New",
    });

    console.log("rendered image:", renderedImage);

    React.useEffect(() => {
        const imageDataRef = dbRef(database, "imageData");
        onValue(imageDataRef, (snapshot) => {
            const data = snapshot.val();
            console.log("snapshot.val:", data);
            setImageData(data);
        });

        const imageRef = ref(storage, "image/");
        listAll(imageRef).then((res) => {
            getDownloadURL(res.items[0])
                .then((url) => {
                    setRenderedImage(url);
                    console.log("image set");
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    }, [renderApp]);

    return (
        <div className="render">
            <p className="render__title">{imageData.title}</p>
            <p className="render__description">{imageData.description}</p>

            <div
                className="image-display"
                style={{
                    backgroundImage: `url(${renderedImage})`,
                }}></div>
        </div>
    );
};

export { RenderData };
