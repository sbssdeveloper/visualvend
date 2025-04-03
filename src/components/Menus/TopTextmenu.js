import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Row, Col, Image } from "react-bootstrap";

import peopleImage from "../../assets/images/people.png";
import vendrun from "../../assets/images/remote.png";
import tasksdone from "../../assets/images/tasks-done.png";
import taptopay from "../../assets/images/Tap-to-Pay.png";
import devices from "../../assets/images/devices.png";
import Service from "../../assets/images/service-updates.png";
import media from "../../assets/images/media.png";
import all from "../../assets/images/all.png";
import products from "../../assets/images/marketing.png";


const TopTextmenu = () => {

  return (
    <section className="menu-order-list">
      <div className="menu-scroll-container">
        <Row className="py-2 menu-list-row">
          <Col xs="auto" className="text-center">
            <div className="menu-list-item">
              <label>All</label>
            </div>
          </Col>
          <Col xs="auto" className="text-center">
            <div className="menu-list-item">
              <label>Products</label>
            </div>
          </Col>
          <Col xs="auto" className="text-center">
            <div className="menu-list-item">
              <label>Devices</label>
            </div>
          </Col>
          <Col xs="auto" className="text-center">
            <div className="menu-list-item">
              <label>Activities</label>
            </div>
          </Col>
          <Col xs="auto" className="text-center">
            <div className="menu-list-item">
              <label>Media</label>
            </div>
          </Col>
          <Col xs="auto" className="text-center">
            <div className="menu-list-item">
              <label>People</label>
            </div>
          </Col>
          <Col xs="auto" className="text-center">
            <div className="menu-list-item">
              <label>Tasks</label>
            </div>
          </Col>
          <Col xs="auto" className="text-center">
            <div className="menu-list-item">
              <label>Vend Run</label>
            </div>
          </Col>
          <Col xs="auto" className="text-center">
            <div className="menu-list-item">
              <label>Service</label>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default TopTextmenu;
