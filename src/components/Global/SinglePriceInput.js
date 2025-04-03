import React, { useState, useEffect, useRef } from "react";
import { Button, Modal } from "react-bootstrap";

const SinglePriceInput = ({
  initialPrice,
  priceRange,
  onPriceChange,
}) => {
  const [price, setPrice] = useState(initialPrice);
  const [modalOpen, setModalOpen] = useState(false);

  // Reference for the scroll container
  const scrollContainerRef = useRef(null);
  
  // References for individual price items
  const priceRefs = useRef([]);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleIncrement = () => {
    const newPrice = Math.min(price + 1, priceRange[1]);
    setPrice(newPrice);
    onPriceChange(newPrice);
  };

  const handleDecrement = () => {
    const newPrice = Math.max(price - 1, priceRange[0]);
    setPrice(newPrice);
    onPriceChange(newPrice);
  };

  const handleConfirm = (newPrice) => {
    setPrice(newPrice);
    onPriceChange(newPrice);
    closeModal();
  };

  // Handle price input from the modal's "Enter Price" field
  const handlePriceInputChange = (e) => {
    const newPrice = Number(e.target.value);
    if (newPrice >= priceRange[0] && newPrice <= priceRange[1]) {
      setPrice(newPrice);
    }
  };

  // Auto-scroll to the selected price when the modal is shown or price changes
  useEffect(() => {
    if (modalOpen && scrollContainerRef.current) {
      // Find the selected price item
      const selectedItem = priceRefs.current.find(
        (ref) => ref && ref.innerText === price.toString()
      );
      if (selectedItem) {
        selectedItem.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [modalOpen, price]);

  return (
    <div className="single-input-container">
      <button
        className="single-price-button"
        type="button"
        onClick={handleDecrement}
      >
        -
      </button>

      <input
        type="text"
        className="single-price-input"
        value={price}
        readOnly
        onClick={openModal}
      />

      <button
        className="single-price-button"
        type="button"
        onClick={handleIncrement}
      >
        +
      </button>

      <Modal show={modalOpen} onHide={closeModal} centered size="sm" dialogClassName="modal-custom price_selector_modal">
        <Modal.Body className="single-price-selector-modal-body">
          <div className="single-scroll-container" ref={scrollContainerRef}>
            {Array.from({ length: priceRange[1] - priceRange[0] + 1 }, (_, i) => i + priceRange[0]).map((priceOption, index) => (
              <div
                key={priceOption}
                ref={(el) => (priceRefs.current[index] = el)}
                className={`single-scroll-item ${priceOption === price ? "selected" : ""}`}
                onClick={() => handleConfirm(priceOption)}
              >
                {priceOption}
              </div>
            ))}
          </div>

          <div className="enter-price-section">
            <input
              type="number"
              value={price}
              onChange={handlePriceInputChange}
              min={priceRange[0]}
              max={priceRange[1]}
              placeholder="Enter price"
            />
          </div>
        </Modal.Body>

        <Modal.Footer className="single-price-selector-modal-footer">
          <Button variant="primary" onClick={() => handleConfirm(price)}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SinglePriceInput;
