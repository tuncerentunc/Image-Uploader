import React from "react";
import "./styles/style.css";
import Form from "./components/Form";
import RenderData from "./components/RenderData";

const App: React.FC = () => {
    const [getData, setgetData] = React.useState(true); // to render RenderData after submitting form
    const [isUploading, setIsUploading] = React.useState(false); // renders loading screen if true

    return (
        <div className="app__container">
            <Form
                setgetData={setgetData}
                isUploading={isUploading}
                setIsUploading={setIsUploading}
            />

            <hr />

            {/* {renders the data from firebase} */}
            <RenderData
                getData={getData}
                isUploading={isUploading}
                setIsUploading={setIsUploading}
            />
        </div>
    );
};

export default App;
