import React from "react";
import "./styles/style.css";
import { Form } from "./components/Form";
import { RenderData } from "./components/RenderData";

const App: React.FC = () => {
    const [renderApp, setRenderApp] = React.useState(true);

    return (
        <div className="app__container">
            <Form setRenderApp={setRenderApp} />

            <hr />

            <RenderData renderApp={renderApp} />
        </div>
    );
};

export default App;
