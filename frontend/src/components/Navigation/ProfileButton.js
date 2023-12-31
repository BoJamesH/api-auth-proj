import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import './ProfileButton.css'
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  }

  const closeMenu = (e) => {
    if (ulRef.current && ulRef.current.contains(e.target)) {
      if (e.target.getAttribute("id") === "DropdownLink") {
        const linkText = e.target.textContent.trim();
        if (linkText === "Manage Properties" || linkText === "Manage Bookings") {
          setShowMenu(false);
        }
      }
      return;
    }
    setShowMenu(false);
  };

  useEffect(() => {
    if (!showMenu) return;

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    history.push('/')
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button className='ProfileButton' onClick={() => setShowMenu(!showMenu)}>
        <i className="fas fa-user-circle" /><i id='HamburgerIcon' className="fas fa-bars"/>
      </button>
      <ul className={ulClassName} ref={ulRef}>
        <li className="UserDropdownItem">Hello, {user.firstName}</li>
        <li className="UserDropdownItem">{user.username}</li>
        <li className="UserDropdownItem">{user.email}</li>
        <li className="UserDropdownItem">
          <NavLink id="DropdownLink" to='/spots/current' onClick={closeMenu}>
            Manage Properties
          </NavLink>
        </li>
        <li className="UserDropdownItem">
          <NavLink id="DropdownLink" to='/bookings/current' onClick={closeMenu}>
            Manage Bookings
          </NavLink>
        </li>
        <li className="UserDropdownItem">
          <NavLink id="DropdownLink" to='/reviews/current' onClick={closeMenu}>
            Manage Reviews
          </NavLink>
        </li>
        <li className="UserDropdownItem" id="DropdownLogoutLi">
          <button className="DropdownLogoutButton" onClick={logout}>Log Out</button>
        </li>
      </ul>
    </>
  );
}

export default ProfileButton;
