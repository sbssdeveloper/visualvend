import React, { useState, useEffect, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const PriceSelectorModal = ({
  show,
  onHide,
  wholePriceRange,
  fractionPriceRange,
  initialWholePrice,
  initialFractionPrice,
  onConfirm,
}) => {
  const [selectedWholePrice, setSelectedWholePrice] = useState(initialWholePrice);
  const [selectedFractionPrice, setSelectedFractionPrice] = useState(initialFractionPrice);

  // Refs for the scroll containers
  const wholePriceRef = useRef(null);
  const fractionPriceRef = useRef(null);

  // Handle price selection from the scroll
  const handleWholePriceSelect = (value) => {
    setSelectedWholePrice(value);
  };

  const handleFractionPriceSelect = (value) => {
    setSelectedFractionPrice(value);
  };

  // Handle input changes
  const handleWholePriceInputChange = (e) => {
    const value = e.target.value;
    if (value === "" || value === "0") {
      setSelectedWholePrice(0); // Select 0 when cleared
    } else {
      const parsedValue = parseInt(value, 10);
      if (parsedValue >= wholePriceRange[0] && parsedValue <= wholePriceRange[wholePriceRange.length - 1]) {
        setSelectedWholePrice(parsedValue);
      }
    }
  };

  const handleFractionPriceInputChange = (e) => {
    const value = e.target.value;
    if (value === "" || value === "0") {
      setSelectedFractionPrice(0); // Select 0 when cleared
    } else {
      const parsedValue = parseInt(value, 10);
      if (parsedValue >= fractionPriceRange[0] && parsedValue <= fractionPriceRange[fractionPriceRange.length - 1]) {
        setSelectedFractionPrice(parsedValue);
      }
    }
  };

  // Confirm selected prices
  const handleConfirm = () => {
    onConfirm(selectedWholePrice, selectedFractionPrice);
    onHide();
  };

  // Scroll to the selected price when the modal is shown or the selected price changes
  useEffect(() => {
    if (wholePriceRef.current && selectedWholePrice !== null) {
      const selectedWholeItem = wholePriceRef.current.querySelector(".selected");
      if (selectedWholeItem) {
        selectedWholeItem.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    if (fractionPriceRef.current && selectedFractionPrice !== null) {
      const selectedFractionItem = fractionPriceRef.current.querySelector(".selected");
      if (selectedFractionItem) {
        selectedFractionItem.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [show, selectedWholePrice, selectedFractionPrice]); // Run this effect on modal visibility or price change

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="sm" // Increase modal size for better mobile feel
      dialogClassName="modal-custom price_selector_modal" // Add custom class for styling
      backdrop="static"
      keyboard={false}
    >
      <Modal.Body className="px-3 py-4"> {/* Add padding for a more spacious look */}
        <div className="d-flex">
          <div className="mx-3 flex-grow-1">
            <div
              ref={wholePriceRef}
              className="scroll-container"
              style={{ maxHeight: "200px", overflowY: "auto" }}
            >
              {wholePriceRange.map((price) => (
                <div
                  key={price}
                  className={`scroll-item ${price === selectedWholePrice ? "selected" : ""}`}
                  onClick={() => handleWholePriceSelect(price)}
                  style={{ cursor: "pointer" }}
                >
                  {price}
                </div>
              ))}
            </div>
          </div>
          <div className="mx-3 flex-grow-1">
            <div
              ref={fractionPriceRef}
              className="scroll-container"
              style={{ maxHeight: "200px", overflowY: "auto" }}
            >
              {fractionPriceRange.map((price) => (
                <div
                  key={price}
                  className={`scroll-item ${price === selectedFractionPrice ? "selected" : ""}`}
                  onClick={() => handleFractionPriceSelect(price)}
                  style={{ cursor: "pointer" }}
                >
                  {price < 10 ? `0${price}` : price}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3">
          <div className="d-flex mx-2">
            <input
              type="number"
              className="form-control mx-2"
              value={selectedWholePrice === 0 ? 0 : selectedWholePrice}
              onChange={handleWholePriceInputChange}
              min={wholePriceRange[0]}
              max={wholePriceRange[wholePriceRange.length - 1]}
              style={{ width: "80px" }}
            />
            <span className="mx-2">.</span>
            <input
              type="number"
              className="form-control mx-2"
              value={selectedFractionPrice === 0 ? 0 : selectedFractionPrice}
              onChange={handleFractionPriceInputChange}
              min={fractionPriceRange[0]}
              max={fractionPriceRange[fractionPriceRange.length - 1]}
              style={{ width: "80px" }}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button variant="primary" onClick={handleConfirm}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PriceSelectorModal;
