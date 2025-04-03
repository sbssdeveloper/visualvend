import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";


const InsightsMenu = ({ selectedMachine }) => {

  const location = useLocation();


  const getSummaryLink = () => {
    return selectedMachine ? "/single-machine" : "/devices-main";
  };


  const isSummaryBold = location.pathname === "/devices-main" || location.pathname === "/single-machine";


  const isListBold = location.pathname === "/insights" || location.pathname === "/single-machine";
  const isAnalyticsBold = location.pathname === "/insights"; 

  return (
    <Container className="p-1">
      <Row className="m-0 align-items-center justify-content-space-bt" style={{ background: "rgb(245 245 245)" }}>
        <Col xs={5} className="d-flex justify-content-start">
          <Link to="/insights" className="text-decoration-none">
            <div className={`text-dark px-2 ${isListBold ? "fw-bold" : ""}`}>
              List
            </div>
          </Link>
          <div className={`text-dark px-2`}>
            Graph
          </div>
        </Col>
        <Col xs={1} className="d-flex justify-content-center">
          <div
            style={{
              borderLeft: "1px solid #000",
              height: "15px",
              alignSelf: "center",
            }}
          ></div>
        </Col>
        <Col xs={5} className="d-flex justify-content-end">
          <Link to={getSummaryLink()} className={`text-decoration-none ${isSummaryBold ? "fw-bold" : ""}`}>
            <div className="text-dark px-2">Summary</div>
          </Link>
          <Link to="/soh" className={`text-decoration-none ${isAnalyticsBold ? "fw-bold" : ""}`}>
            <div className="text-dark px-2">Analytics</div>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default InsightsMenu;
