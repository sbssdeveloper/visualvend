import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  Button,
  Form,
  InputGroup,
  Modal,
  ListGroup,
  CloseButton,
} from "react-bootstrap";
import { useDatefilterContext } from "../../contexts/DatefilterContext";

const Datefilter = () => {
  const { showDateFilter, setShowDateFilter } = useDatefilterContext();
  const [touchStartY, setTouchStartY] = useState(0);
  const dateFilterRef = useRef(null);

  const toggleCalendarModal = () => setShowCalendarModal(!showCalendarModal);
  const toggleListModal = () => setShowListModal(!showListModal);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("Today");

  const handleTouchStart = (e) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    const touchEndY = e.touches[0].clientY;

    if (touchEndY - touchStartY > 5) {
      setShowDateFilter(false);
    }
  };

  useEffect(() => {
    const dateFilterElement = dateFilterRef.current;

    if (dateFilterElement) {
      const handleTouchStartNative = (e) => {
        handleTouchStart(e);
      };
      const handleTouchMoveNative = (e) => {
        handleTouchMove(e);
      };

      dateFilterElement.addEventListener("touchstart", handleTouchStartNative);
      dateFilterElement.addEventListener("touchmove", handleTouchMoveNative);

      return () => {
        dateFilterElement.removeEventListener("touchstart", handleTouchStartNative);
        dateFilterElement.removeEventListener("touchmove", handleTouchMoveNative);
      };
    }
  }, [touchStartY]);

  const selectLabel = (label) => {
    setSelectedLabel(label); // Update button label
    setShowListModal(false); // Close the list modal
  };

  const truncateLabel = (label) =>
    label.length > 10 ? `${label.slice(0, 10)}…` : label;

  return (
    <section
      ref={dateFilterRef}
      className={`date-search-filters position-relative ${showDateFilter ? "" : "d-none"}`}  // Hide the section when showDateFilter is false
    >
      <div className="row gx-0 d-flex py-2 calender-bg">
        <div className="col d-flex align-items-center justify-content-around calender-search p-1">
          {/* Calendar Icon */}
          <div>
            <i
              className="bi bi-calendar mx-2 fs-4"
              onClick={toggleCalendarModal}
              style={{ cursor: "pointer" }}
            ></i>
          </div>

          {/* List Modal Toggle */}
          <div className="mx-2">
            <Button
              variant="outline-secondary"
              onClick={toggleListModal}
              style={{ borderRadius: "5px" }}
            >
              {truncateLabel(selectedLabel)}
            </Button>
          </div>

          {/* Search Input */}
          <div className="input-group input-group-sm w-50">
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search"
                aria-label="Search"
                aria-describedby="search-icon"
                className="border-end-0"
              />
              <InputGroup.Text id="search-icon">
                <i className="bi bi-search"></i>
              </InputGroup.Text>
            </InputGroup>
          </div>
        </div>
      </div>

      {/* Calendar Modal */}
      <Modal show={showCalendarModal} onHide={toggleCalendarModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Date Range</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-6">
              <p className="m-0">START DATE / TIME</p>
              <Form.Control
                type="datetime-local"
                name="start_datetime"
                className="mt-1 start_datetime"
              />
            </div>
            <div className="col-6">
              <p className="m-0">END DATE / TIME</p>
              <Form.Control
                type="datetime-local"
                name="end_datetime"
                className="mt-1 end_datetime"
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showListModal} onHide={toggleListModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select a Time Period</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {["Today", "Yesterday", "Last 7 Days"].map((label) => (
              <ListGroup.Item
                key={label}
                action
                active={selectedLabel === label}
                onClick={() => selectLabel(label)}
              >
                {label}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default Datefilter;
