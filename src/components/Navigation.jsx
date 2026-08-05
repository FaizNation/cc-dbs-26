import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import LocaleContext from "../contexts/LocaleContext";

function Navigation({ logout, name }) {
  const { locale } = React.useContext(LocaleContext);

  return (
    <nav className="navigation">
      <ul>
        <li>
          <Link to="/">{locale === "id" ? "Catatan" : "Notes"}</Link>
        </li>
        <li>
          <Link to="/archives">{locale === "id" ? "Arsip" : "Archives"}</Link>
        </li>
        <li>
          <span className="navigation__user-name">
            {locale === "id" ? "Halo" : "Hello"}, {name}!
          </span>
        </li>
        <li>
          <button className="navigation__logout-button" onClick={logout}>
            {locale === "id" ? "Logout" : "Logout"}
          </button>
        </li>
      </ul>
    </nav>
  );
}

Navigation.propTypes = {
  logout: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default Navigation;
