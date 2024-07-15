import React from "react";
import "./Template.css";

const Template = ({ Component }) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
        <div className="cardCont">
          <Component />
        </div>
      </div>
    </>
  );
};

export default Template;
