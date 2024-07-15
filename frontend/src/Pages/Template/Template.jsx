import React from "react";
import "./Template.css";

const Template = ({ Component }) => {
  return (
    <>
      {/* Container for the entire page */}
      <div className="pageCont">
        {/* Container for the card centered in the middle of the page */}
        <div className="cardCont">
          <Component />
        </div>
      </div>
    </>
  );
};

export default Template;
