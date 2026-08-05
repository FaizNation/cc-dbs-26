import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function Navigation() {
    return (
        <nav className="navigation">
            <ul>
                <li><Link to="/">Catatan</Link></li>
                <li><Link to="/archives">Arsip</Link></li>
            </ul>
        </nav>
    );
}

export default Navigation;
