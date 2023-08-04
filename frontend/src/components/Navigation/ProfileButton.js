// frontend/src/components/Navigation/ProfileButton.js
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import './ProfileButton.css'
import { NavLink } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();


  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  }

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
        if (!ulRef.current.contains(e.target)) {
          setShowMenu(false);
        }
      };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button className='ProfileButton' onClick={() => setShowMenu(!showMenu)}>
        <i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        <li className="UserDropdownItem">{user.username}</li>
        <li className="UserDropdownItem">{user.firstName} {user.lastName}</li>
        <li className="UserDropdownItem">{user.email}</li>
        <li className="UserDropdownItem"><NavLink id="DropdownLink" to='/spots/current'>Manage Properties</NavLink></li>
        <li className="UserDropdownItem" id="DropdownLogoutLi">
          <button className="DropdownLogoutButton" onClick={logout}>Log Out</button>
        </li>
      </ul>
    </>
  );
}

export default ProfileButton;
