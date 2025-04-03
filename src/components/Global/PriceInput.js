import React, { useState, useEffect } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import PriceSelectorModal from './PriceSelectorModal'; 

const PriceInput = ({
  initialWholePrice,
  initialFractionPrice,
  onPriceChange,
  wholePriceRange,
  fractionPriceRange
}) => {
  const [wholePrice, setWholePrice] = useState(initialWholePrice); 
  const [fractionPrice, setFractionPrice] = useState(initialFractionPrice); 
  const [modalOpen, setModalOpen] = useState(false); 

  const openModal = () => setModalOpen(true); 
  const closeModal = () => setModalOpen(false); 

  const handleConfirm = (whole, fraction) => {
    setWholePrice(whole);
    setFractionPrice(fraction);
    onPriceChange(whole, fraction); 
    closeModal();
  };

  const incrementWhole = () => {
    setWholePrice((prev) => {
      const newWhole = Math.min(prev + 1, wholePriceRange[1]);
      onPriceChange(newWhole, fractionPrice); 
      return newWhole;
    });
  };

  const decrementWhole = () => {
    setWholePrice((prev) => {
      const newWhole = Math.max(prev - 1, wholePriceRange[0]);
      onPriceChange(newWhole, fractionPrice); 
      return newWhole;
    });
  };

  const incrementFraction = () => {
    setFractionPrice((prev) => {
      let newFraction = prev + 1;
      if (newFraction > fractionPriceRange[1]) {
        newFraction = 0; // Reset to 0 if it exceeds the max range
        setWholePrice((prevWhole) => Math.min(prevWhole + 1, wholePriceRange[1])); // Increment whole price when fraction overflows
      }
      onPriceChange(wholePrice, newFraction); 
      return newFraction;
    });
  };

  const decrementFraction = () => {
    setFractionPrice((prev) => {
      let newFraction = prev === 0 ? 0 : prev - 1; // Prevent going below 0
      if (newFraction === fractionPriceRange[1] && wholePrice > wholePriceRange[0]) {
        setWholePrice((prevWhole) => prevWhole - 1); // Decrement whole price when reaching max fraction
      }
      onPriceChange(wholePrice, newFraction); 
      return newFraction;
    });
  };
 
  useEffect(() => {
    setWholePrice(initialWholePrice);
    setFractionPrice(initialFractionPrice);
  }, [initialWholePrice, initialFractionPrice]);

  return (
    <>
      <Row className="justify-content-space icons-font">
        <Col xs="5" className='d-flex justify-content-space px-0'>
          <button type="button" className="btn p-0" onClick={decrementWhole}>
            <i className="bi bi-dash-lg"></i> 
          </button>
          <Form.Control
            type="text"
            value={wholePrice}
            readOnly
            className="text-center p-1"
            style={{ width: '40px' }}
            onClick={openModal}
          />
          <button type="button" className="btn p-0" onClick={incrementWhole}>
            <i className="bi bi-plus-lg"></i> 
          </button>
        </Col>
        <Col xs="1" className='p-0'><div className="mx-1 p-0">.</div></Col>
        <Col xs="5" className="d-flex justify-content-space px-0">
            <button type="button" className="btn p-0" onClick={decrementFraction}>
              <i className="bi bi-dash-lg"></i> 
            </button>
            <Form.Control
              type="text"
              value={fractionPrice < 10 ? `${fractionPrice}` : fractionPrice}
              readOnly
              className="text-center p-1"
              style={{ width: '40px' }}
              onClick={openModal}
            />
            <button type="button" className="btn p-0" onClick={incrementFraction}>
              <i className="bi bi-plus-lg"></i> 
            </button>
        </Col>
      </Row>
      {modalOpen && (
        <PriceSelectorModal
          show={modalOpen}
          onHide={closeModal}
          wholePriceRange={Array.from({ length: wholePriceRange[1] - wholePriceRange[0] + 1 }, (_, i) => i + wholePriceRange[0])} 
          fractionPriceRange={Array.from({ length: fractionPriceRange[1] + 1 }, (_, i) => i)} 
          initialWholePrice={wholePrice}
          initialFractionPrice={fractionPrice}
          onConfirm={handleConfirm} 
        />
      )}
    </>
  );
};

export default PriceInput;
