import React from "react";
import "../assets/css/nav/nav1.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";

function Nav1() {
  return (
    
    <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-center">
      <div id="nav1-content-container">
        <div id="logo-container" class="d-flex align-items-center w-33">
          <a
            className="navbar-brand d-flex align-items-center"
            href="./index.js"
          >
            <img
              src={require("../assets/logo/logo1.png")}
              className="align-center w-85 h-auto"
              alt=""
            />
            <span
              id="logo-text"
              className="ms-2"
              style={{ fontSize: "30px", fontWeight: "bold" }}
            >
              SGU Fitness Club
            </span>
          </a>
        </div>
        <div
          id="search-bar"
          style={{ flex: 1 }}
          className="d-flex align-items-center w-33"
        >
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm sản phẩm"
            style={{ flex: 1, height: "70px", margin: "0 50px", fontSize: "30px" }}
          />
          <button
            className="btn btn-outline-primary"
            style={{ width: "70px", height: 70 }}
            type="submit"
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        <div id="login_signin_infor" className="d-flex align-items-center w-33">
          <div id="infor-container"></div>
          <button
            className="btn btn-outline-primary ms-auto"
            style={{ margin: "50px" }}
            type="button"
          >
            <p>Đăng nhập/Đăng ký</p>
            <FontAwesomeIcon icon={faSignInAlt} />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Nav1;
