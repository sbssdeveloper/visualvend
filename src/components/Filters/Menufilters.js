import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, Dropdown, Image } from "react-bootstrap"; // React Bootstrap components
import descending from "../../assets/images/descending.png";
import ascending from "../../assets/images/ascending.png";
import action_required from "../../assets/images/action_required.png";
import recently_active from "../../assets/images/recently_active.png";
import creation_date from "../../assets/images/creation_date.png";
import { useMenufiltersContext } from "../../contexts/MenufiltersContext";

const Menufilters = ({ filters = [] }) => {
  const [selectedIcon, setSelectedIcon] = useState(descending); // Default selected icon
  const [touchStartY, setTouchStartY] = useState(0); // Store initial touch position
  const filtersRef = useRef(null); // Ref for the Menufilters component
  const { showFilters, setShowFilters } = useMenufiltersContext();
  const icons = [
    { id: "descending", src: descending },
    { id: "ascending", src: ascending },
    { id: "action_required", src: action_required },
    { id: "recently_active", src: recently_active },
    { id: "creation_date", src: creation_date },
  ];

  const handleIconSelect = (iconSrc) => {
    setSelectedIcon(iconSrc); // Set the selected icon
  };

  const handleTouchStart = (e) => {
    setTouchStartY(e.touches[0].clientY); // Record the Y-position of the touch start
  };

  const handleTouchMove = (e) => {
    const touchEndY = e.touches[0].clientY; // Get the Y-position of the current touch
    if (touchEndY - touchStartY > 5) {
      // Swipe down
      if (showFilters) {
        setShowFilters(false);
      }
    }
  };

  useEffect(() => {
    const filtersElement = filtersRef.current;

    if (filtersElement) {
      filtersElement.addEventListener("touchstart", handleTouchStart);
      filtersElement.addEventListener("touchmove", handleTouchMove);

      return () => {
        filtersElement.removeEventListener("touchstart", handleTouchStart);
        filtersElement.removeEventListener("touchmove", handleTouchMove);
      };
    }
  }, [showFilters, touchStartY]);

  // Function to dynamically render filters
  const renderFilter = (filter) => {
    switch (filter.type) {
      case "dropdown":
        return (
          <Col
            xs={filter.colSize || 4}
            key={filter.id}
            className="custom-dropdown pe-0 mt-3 mb-2"
          >
            <div className="custom-dropdown-wrapper">
              <Form.Select
                aria-label={filter.label}
                onChange={(e) => filter.onChange && filter.onChange(e)}
                value={filter.value} // Set the value to the filter's value
              >
                {filter.options.map((option, idx) => (
                  <option key={idx} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
              <i className="bi bi-caret-down-fill custom-arrow"></i>
            </div>
          </Col>
        );
      case "icon":
        return (
          <Col
            xs={filter.colSize || 2}
            key={filter.id}
            className="d-flex justify-content-end"
          >
            <Dropdown>
              <Dropdown.Toggle variant="light" className="p-0 border-0">
                <Image
                  src={selectedIcon}
                  alt="Selected Icon"
                  style={{ maxWidth: "30px" }}
                />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {icons.map((icon) => (
                  <Dropdown.Item
                    key={icon.id}
                    onClick={() => handleIconSelect(icon.src)}
                  >
                    <Image
                      src={icon.src}
                      alt={icon.id}
                      style={{ maxWidth: "30px", marginRight: "10px" }}
                    />
                    {icon.id.replace("_", " ").toUpperCase()}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        );
      default:
        return null;
    }
  };
 
  return (
    <>
      {showFilters && (
        <section ref={filtersRef} className="py-1 pb-2">
          <Container fluid>
            <Row className="align-items-center  border-top">
              {filters.map((filter) => renderFilter(filter))}
            </Row>
          </Container>
        </section>
      )}
    </>
  );
};

export default Menufilters;
