import React from "react";

type Props = {
    children: React.ReactNode;
};

const LayoutTemplate: React.FC<Props> = ({ children }) => {
    return (
        <div className="layout-template">
            <p className="layout-template__badge">New Title</p>

            {children}
        </div>
    );
};

export { LayoutTemplate };
