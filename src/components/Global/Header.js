import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Container, Row, Col, Image } from "react-bootstrap";
import logoImage from "../../assets/images/visual-logo.png";
import machine from "../../assets/images/devices.png";
import { useHeaderContext } from "../../contexts/HeaderContext";
import { useDatefilterContext } from "../../contexts/DatefilterContext";
import { useMenufiltersContext } from "../../contexts/MenufiltersContext";

const Header = ({ title, onMenuIconClick }) => {
  const { isFirstRowVisible, setIsFirstRowVisible } = useHeaderContext();
  const [touchStartY, setTouchStartY] = useState(0);
  const headerRef = useRef(null);
  const { showDateFilter, setShowDateFilter } = useDatefilterContext();
  const { showFilters, setShowFilters } = useMenufiltersContext();

  const handleTouchStart = (e) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    const touchEndY = e.touches[0].clientY;

    if (touchStartY - touchEndY > 10) {
      if (isFirstRowVisible) {
        setIsFirstRowVisible(false);
      }
    } else if (touchEndY - touchStartY > 10) {
      if (!isFirstRowVisible) {
        setIsFirstRowVisible(true);
      }
    }
  };

  useEffect(() => {
    const headerElement = headerRef.current;

    if (headerElement) {
      const handleTouchStartNative = (e) => {
        handleTouchStart(e);
      };
      const handleTouchMoveNative = (e) => {
        handleTouchMove(e);
      };

      headerElement.addEventListener("touchstart", handleTouchStartNative);
      headerElement.addEventListener("touchmove", handleTouchMoveNative);

      return () => {
        headerElement.removeEventListener("touchstart", handleTouchStartNative);
        headerElement.removeEventListener("touchmove", handleTouchMoveNative);
      };
    }
  }, [touchStartY, isFirstRowVisible]);

  const handleToggleDateFilter = () => {
    setShowDateFilter(!showDateFilter); // Toggle date filter visibility
  };

  const handleToggleFilters = () => {
    setShowFilters((prev) => !prev); // Toggle filters visibility
  };

  return (
    <header ref={headerRef} className="border-bottom border-1 header">
      <Container className="px-4">
        {isFirstRowVisible && (
          <Row className="align-items-center pt-2">
            <Col xs={3} className="d-flex justify-content-start">
              <i className="bi bi-list fs-4"></i>
            </Col>
            <Col xs={6} className="text-center">
              <Image
                src={logoImage}
                alt="VisualVend Logo"
                fluid
                className="logo"
              />
            </Col>
            <Col xs={3} className="d-flex justify-content-end">
              <i
                className={`bi fs-4 ${showDateFilter ? 'bi-heart' : 'bi-search'}`}
                onClick={showDateFilter ? undefined : handleToggleDateFilter} // Only attach onClick to search icon
              ></i>

            </Col>
          </Row>
        )}

        <Row className="align-items-center my-2">
          <Col xs={2} className="d-flex justify-content-start">
            <Image
              src={machine}
              alt="VisualVend Machine"
              fluid
              className="menu-icon"
              onClick={handleToggleFilters}
              style={{ cursor: "pointer", maxWidth: "30px" }}
            />
          </Col>
          <Col xs={8} className="text-center">
            <h1 className="main-menu-text">{title}</h1>
          </Col>
          <Col xs={2} className="d-flex justify-content-end">
            <i className="bi bi-three-dots-vertical fs-4"></i>
          </Col>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
