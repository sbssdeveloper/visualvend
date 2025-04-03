import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Row, Col, Image } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

import peopleImage from "../../assets/images/people.png";
import vendrun from "../../assets/images/remote.png";
import tasksdone from "../../assets/images/tasks-done.png";
import taptopay from "../../assets/images/Tap-to-Pay.png";
import devices from "../../assets/images/devices.png";
import Service from "../../assets/images/service-updates.png";
import media from "../../assets/images/media.png";
import all from "../../assets/images/all.png";
import product from "../../assets/images/product.png";
import { useMenuState } from "../../contexts/TopMenuStateProvider";

const Topmenu = () => {
  const { activeMenu, setActiveMenu, showMenu, setShowMenu } = useMenuState();
  const [touchStartY, setTouchStartY] = useState(0);
  const topmenuRef = useRef(null);
  const location = useLocation();

  const handleTouchStart = (e) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    const touchEndY = e.touches[0].clientY;

    if (touchEndY - touchStartY > 10 && !showMenu) {
      setShowMenu(true);
    } else if (touchStartY - touchEndY > 10 && showMenu) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    const pathname = location.pathname;
    if (pathname.includes("insights")) {
      setActiveMenu("insights");
    } else if (pathname.includes("products")) {
      setActiveMenu("products");
    } else if (pathname.includes("add-product")) {
      setActiveMenu("products");
    } else if (pathname.includes("Device-management")) {
      setActiveMenu("devices");
    } else if (pathname.includes("single-machine")) {
      setActiveMenu("devices");
    } else if (pathname.includes("devices")) {
      setActiveMenu("devices");
    } else if (pathname.includes("activities")) {
      setActiveMenu("activities");
    } else if (pathname.includes("media")) {
      setActiveMenu("media");
    } else if (pathname.includes("people")) {
      setActiveMenu("people");
    } else if (pathname.includes("tasks")) {
      setActiveMenu("tasks");
    } else if (pathname.includes("vendrun")) {
      setActiveMenu("vendrun");
    } else if (pathname.includes("service")) {
      setActiveMenu("service");
    } else {
      setActiveMenu("");
    }
  }, [location]);

  useEffect(() => {
    const topmenuElement = topmenuRef.current;

    if (topmenuElement) {
      const handleTouchStartNative = (e) => {
        handleTouchStart(e);
      };
      const handleTouchMoveNative = (e) => {
        handleTouchMove(e);
      };

      topmenuElement.addEventListener("touchstart", handleTouchStartNative);
      topmenuElement.addEventListener("touchmove", handleTouchMoveNative);

      return () => {
        topmenuElement.removeEventListener("touchstart", handleTouchStartNative);
        topmenuElement.removeEventListener("touchmove", handleTouchMoveNative);
      };
    }
  }, [showMenu, touchStartY]);

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
  };

  return (
    <section className="menu-order-list" ref={topmenuRef}>
      <div className="menu-scroll-container">
        <Row className="py-2 px-2 menu-list-row">
          <Col xs="auto" className="text-center">
            <div
              className="menu-list-item"
              onClick={() => handleMenuClick("insights")}
            >
              <Link to="/insights">
                <div>
                  {showMenu && (
                    <div>
                      <Image src={all} alt="All" className="horizontal-menu-list" />
                      <br />
                    </div>
                  )}
                  <label style={{ fontWeight: activeMenu === "insights" ? "bold" : "normal" }}>
                    ALL
                  </label>
                </div>
              </Link>
            </div>
          </Col>

          <Col xs="auto" className="text-center">
            <div
              className="menu-list-item"
              onClick={() => handleMenuClick("products")}
            >
              <Link to="/products">
                <div>
                  {showMenu && (
                    <div>
                      <Image
                        src={product}
                        alt="Products"
                        className="horizontal-menu-list"
                      />
                      <br />
                    </div>
                  )}
                  <label
                    style={{
                      fontWeight: activeMenu === "products" ? "bold" : "normal",
                    }}
                  >
                    PRODUCTS
                  </label>
                </div>
              </Link>
            </div>
          </Col>

          <Col xs="auto" className="text-center">
            <div
              className="menu-list-item"
              onClick={() => handleMenuClick("devices")}
            >
              <Link to="/device-actions">
                <div>
                  {showMenu && (
                    <div>
                      <Image
                        src={devices}
                        alt="Devices"
                        className="horizontal-menu-list"
                      />
                      <br />
                    </div>
                  )}
                  <label
                    style={{
                      fontWeight: activeMenu === "devices" ? "bold" : "normal",
                    }}
                  >
                    DEVICES
                  </label>
                </div>
              </Link>
            </div>
          </Col>

          <Col xs="auto" className="text-center">
            <div
              className="menu-list-item"
              onClick={() => handleMenuClick("activities")}
            >
              <Link to="/insights">
                {showMenu && (
                  <div>
                    <Image
                      src={taptopay}
                      alt="Activities"
                      className="horizontal-menu-list list-activity"
                    />
                    <br />
                  </div>
                )}
                <label
                  style={{
                    fontWeight: activeMenu === "activities" ? "bold" : "normal",
                  }}
                >
                  ACTIVITIES
                </label>
              </Link>
            </div>
          </Col>

          <Col xs="auto" className="text-center">
            <div
              className="menu-list-item"
              onClick={() => handleMenuClick("media")}
            >
              <Link to="/insights">
                {showMenu && (
                  <div>
                    <Image
                      src={media}
                      alt="Media"
                      className="horizontal-menu-list"
                    />
                    <br />
                  </div>
                )}
                <label
                  style={{
                    fontWeight: activeMenu === "media" ? "bold" : "normal",
                  }}
                >
                  MEDIA
                </label>
              </Link>
            </div>
          </Col>

          <Col xs="auto" className="text-center">
            <div
              className="menu-list-item"
              onClick={() => handleMenuClick("people")}
            >
              <Link to="/insights">
                {showMenu && (
                  <div>
                    <Image
                      src={peopleImage}
                      alt="People"
                      className="horizontal-menu-list"
                    />
                    <br />
                  </div>
                )}
                <label
                  style={{
                    fontWeight: activeMenu === "people" ? "bold" : "normal",
                  }}
                >
                  PEOPLE
                </label>
              </Link>
            </div>
          </Col>

          <Col xs="auto" className="text-center">
            <div
              className="menu-list-item"
              onClick={() => handleMenuClick("tasks")}
            >
              <Link to="/insights">
                <div>
                  {showMenu && (
                    <div>
                      <Image
                        src={tasksdone}
                        alt="Tasks"
                        className="horizontal-menu-list"
                      />
                      <br />
                    </div>
                  )}
                  <label
                    style={{
                      fontWeight: activeMenu === "tasks" ? "bold" : "normal",
                    }}
                  >
                    TASKS
                  </label>
                </div>
              </Link>
            </div>
          </Col>

          <Col xs="auto" className="text-center">
            <div
              className="menu-list-item"
              onClick={() => handleMenuClick("vendrun")}
            >
              <Link to="/insights">
                {showMenu && (
                  <div>
                    <Image
                      src={vendrun}
                      alt="Vend Run"
                      className="horizontal-menu-list"
                    />
                    <br />
                  </div>
                )}
                <label
                  style={{
                    fontWeight: activeMenu === "vendrun" ? "bold" : "normal",
                  }}
                >
                  VEND RUN
                </label>
              </Link>
            </div>
          </Col>

          <Col xs="auto" className="text-center">
            <div
              className="menu-list-item"
              onClick={() => handleMenuClick("service")}
            >
              <Link to="/service">
                {showMenu && (
                  <div>
                    <Image
                      src={Service}
                      alt="Service"
                      className="horizontal-menu-list"
                    />
                    <br />
                  </div>
                )}
                <label
                  style={{
                    fontWeight: activeMenu === "service" ? "bold" : "normal",
                  }}
                >
                  SERVICE
                </label>
              </Link>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default Topmenu;
