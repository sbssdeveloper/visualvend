import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Container, Row, Col, Image } from "react-bootstrap"; // Import React Bootstrap components
import peopleImage from "../../assets/images/people.png";
import remote from "../../assets/images/remote.png";
import tasksdone from "../../assets/images/tasks-done.png";
import taptopay from "../../assets/images/Tap-to-Pay.png";
import devices from "../../assets/images/devices.png";
import Vendrun from "../../assets/images/vendrun.png";
import media from "../../assets/images/media.png";
import all from "../../assets/images/all.png";
import product from "../../assets/images/product.png";
import assetmgt from "../../assets/images/assetmgt.png";
import Promos from "../../assets/images/Promos.png";
import services from "../../assets/images/services.png";
import { Link } from "react-router-dom";

const Menuorderlist = () => {
  return (
    <section className="menu-order-list">
      <div className="vd-scroll">
        {/* First Row */}
        <Row className="text-center pt-2 gx-0">
          <Col xs={4} className="pb-2">
            <div className="d-flex flex-column align-items-center">
              <Link to="/insights">
                <Image src={all} alt="menu" className="menu-list" fluid />
              </Link>
              <label>ALL</label>
            </div>
          </Col>
          <Col xs={4} className="pb-2">
            <div className="d-flex flex-column align-items-center">
              <Link to="/products">
                <Image src={product} alt="menu" className="menu-list" fluid />
              </Link>
              <label>PRODUCTS</label>
            </div>
          </Col>
          <Col xs={4} className="pb-2">
            <div className="d-flex flex-column align-items-center">
              <Link to="/device-actions">
                <Image src={devices} alt="menu" className="menu-list" fluid />
              </Link>
              <label>DEVICES</label>
            </div>
          </Col>
        </Row>

        <div className="custom-line"></div>

        {/* Second Row */}
        <Row className="text-center pt-3 gx-0">
          <Col xs={4} className="pb-2">
            <div className="d-flex flex-column align-items-center">
              <Image
                src={taptopay}
                alt="menu"
                className="menu-list list-activity"
                fluid
              />
              <label>ACTIVITIES</label>
            </div>
          </Col>
          <Col xs={4} className="pb-2">
            <div className="d-flex flex-column align-items-center">
              <Image src={media} alt="menu" className="menu-list" fluid />
              <label>MEDIA</label>
            </div>
          </Col>
          <Col xs={4} className="pb-2">
            <div className="d-flex flex-column align-items-center">
              <Image src={peopleImage} alt="menu" className="menu-list" fluid />
              <label>PEOPLE</label>
            </div>
          </Col>
        </Row>

        <div className="custom-line"></div>

        {/* Third Row */}
        <Row className="text-center pt-3 gx-0">
          <Col xs={4}>
            <div className="d-flex flex-column align-items-center">
              <Image src={tasksdone} alt="menu" className="menu-list" fluid />
              <label>TASKS</label>
            </div>
          </Col>
          <Col xs={4}>
            <div className="d-flex flex-column align-items-center">
              <Image src={remote} alt="menu" className="menu-list" fluid />
              <label>REMOTE</label>
            </div>
          </Col>
          <Col xs={4}>
            <div className="d-flex flex-column align-items-center">
              <Image src={services} alt="menu" className="menu-list" fluid />
              <label>SERVICES</label>
            </div>
          </Col>
        </Row>

        <div className="custom-line"></div>

        <Row className="text-center pt-3 gx-0">
          <Col xs={4}>
            <div className="d-flex flex-column align-items-center">
              <Image src={Vendrun} alt="menu" className="menu-list" fluid />
              <label>VEND RUN</label>
            </div>
          </Col>
          <Col xs={4}>
            <div className="d-flex flex-column align-items-center">
              <Image src={assetmgt} alt="menu" className="menu-list" fluid />
              <label>ASSETMGT</label>
            </div>
          </Col>
          <Col xs={4}>
            <div className="d-flex flex-column align-items-center">
              <Image src={Promos} alt="menu" className="menu-list" fluid />
              <label>PROMOS</label>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default Menuorderlist;
