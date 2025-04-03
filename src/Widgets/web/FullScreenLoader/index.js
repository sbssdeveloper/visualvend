import React from "react";
import Spinner from "../Spinner";
// import LogoImg from "../../assets/images/vendLogo.png";
import QLogo from "../../../Assets/web/images/qlogo.png";
const FullScreenLoader = () => {
  return (
    <div
      className=" d--flex align-items--center justify-content--center w--full h--full bg--black-200 position--fixed left--0 top--0
    z-index--md"
    >
      {/* <Spinner /> */}
      <img src={QLogo} alt="" width={45} className="logoImg zoom-in-zoom-out" />
    </div>
  );
};
export default FullScreenLoader;
