import React from "react";
import "./styles/style.css";
import Form from "./components/Form";
import RenderData from "./components/RenderData";

const App: React.FC = () => {
    const [getData, setgetData] = React.useState(true);
    const [isUploading, setIsUploading] = React.useState(false);

    return (
        <div className="app__container">
            <Form setgetData={setgetData} setIsUploading={setIsUploading} />

            <hr />

            <RenderData
                getData={getData}
                isUploading={isUploading}
                setIsUploading={setIsUploading}
            />
        </div>
    );
};

export default App;
