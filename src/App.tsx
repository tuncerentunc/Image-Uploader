import React from "react";
import "./styles/style.css";
import { LayoutTemplate } from "./components/LayoutTemplate";
import { Form } from "./components/Form";
import { RenderData } from "./components/RenderData";

const App: React.FC = () => {
    const [renderApp, setRenderApp] = React.useState(true);

    return (
        <div className="app__container">
            <LayoutTemplate>
                <Form setRenderApp={setRenderApp} />
            </LayoutTemplate>

            <hr />

            <LayoutTemplate>
                <RenderData renderApp={renderApp} />
            </LayoutTemplate>
        </div>
    );
};

export default App;
