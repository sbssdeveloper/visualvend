import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import login from "../../assets/images/alerts.png";
import Home from "../../assets/images/Home.png";
import reports from "../../assets/images/reports.png";
import Insights from "../../assets/images/Insights.png";
import detailes from "../../assets/images/detailes.png";
import back from "../../assets/images/back-btn.png";
import { useFooterContext } from "../../contexts/FooterContext";

const Footer = ({ backUrl }) => {
  const { showMenu, setShowMenu } = useFooterContext();
  const [touchStartY, setTouchStartY] = useState(0);
  const footerRef = useRef(null);

  const handleTouchStart = (e) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    const touchEndY = e.touches[0].clientY;
    if (touchEndY - touchStartY > 5) {
      if (showMenu) {
        setShowMenu(false);
      }
    } else if (touchStartY - touchEndY > 5) {
      if (!showMenu) {
        setShowMenu(true);
      }
    }
  };

  useEffect(() => {
    const footerElement = footerRef.current;

    if (footerElement) {
      const handleTouchStartNative = (e) => {
        handleTouchStart(e);
      };
      const handleTouchMoveNative = (e) => {
        handleTouchMove(e);
      };

      footerElement.addEventListener("touchstart", handleTouchStartNative);
      footerElement.addEventListener("touchmove", handleTouchMoveNative);

      return () => {
        footerElement.removeEventListener("touchstart", handleTouchStartNative);
        footerElement.removeEventListener("touchmove", handleTouchMoveNative);
      };
    }
  }, [showMenu, touchStartY]);

  return (
    <footer ref={footerRef}>
      <Row className="gx-0 px-3 d-flex justify-content-between align-items-center">
        <Col xs={1} className="text-center pb-2">
          <div className="d-flex flex-column align-items-center pt-2 vd-label">
            {backUrl ? (
              <Link to={backUrl} className="text-decoration-none text-black">

                {showMenu && (
                  <div>
                    <img src={back} alt="Back" className="menu-list-bottom" />
                    <br />
                  </div>
                )}
                <label>Back</label>

              </Link>
            ) : (

              <Link to="/" className="text-decoration-none text-black">

                {showMenu && (
                  <div>
                    <img src={Home} alt="Home" className="menu-list-bottom" />
                    <br />
                  </div>
                )}

                <label>Home</label>

              </Link>

            )}
          </div>
        </Col>

        <Col xs={1} className="text-center pb-2">
          <div className="d-flex flex-column align-items-center pt-2 vd-label">
            <Link to="/insights" className="text-decoration-none text-black">

              {showMenu && (
                <div>
                  <img
                    src={Insights}
                    alt="Insights"
                    className="menu-list-bottom"
                  />
                  <br />
                </div>
              )}

              <label>Insights</label>

            </Link>
          </div>
        </Col>

        <Col xs={1} className="text-center pb-2">
          <div className="d-flex flex-column align-items-center pt-2 vd-label">
            <Link to="/products" className="text-decoration-none text-black">

              {showMenu && (
                <div>
                  <img
                    src={detailes}
                    alt="Details"
                    className="menu-list-bottom"
                  />
                  <br />
                </div>
              )}

              <label>Details</label>

            </Link>
          </div>
        </Col>

        <Col xs={1} className="text-center pb-2">
          <div className="d-flex flex-column align-items-center pt-2 vd-label">
            <Link to="/alerts" className="text-decoration-none text-black">

              {showMenu && (
                <div>
                  <img src={login} alt="Login" className="menu-list-bottom" />
                  <br />
                </div>
              )}

              <label>Alerts</label>

            </Link>
          </div>
        </Col>

        <Col xs={1} className="text-center pb-2">
          <div className="d-flex flex-column align-items-center pt-2 vd-label">
            <Link to="/reports" className="text-decoration-none text-black">

              {showMenu && (
                <div>
                  <img src={reports} alt="Reports" className="menu-list-bottom" />
                  <br />
                </div>
              )}

              <label>Reports</label>

            </Link>
          </div>
        </Col>
        <Col xs={1} className="text-center pb-2">
          <div className="d-flex text-center flex-column align-items-center  vd-label">
            <Link to="/login" className="text-decoration-none text-black">

              {showMenu && (
                <div>
                  <i className="bi bi-person-circle vd-font menu-list-bottom"></i>
                  <br />
                </div>
              )}

              <label>Login</label>

            </Link>
          </div>
        </Col>

        <Col xs={1} className="text-center pb-2">
          <div className="d-flex text-center flex-column align-items-center pt-2  vd-label">
            <Link to="/reports" className="text-decoration-none text-black">

              {showMenu && (
                <div>
                  <i className="bi bi-three-dots-vertical vd-font menu-list-bottom"></i>
                  <br />
                </div>
              )}

              <label>More</label>

            </Link>
          </div>
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
