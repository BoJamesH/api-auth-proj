import React from "react";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <>
        <span>
          <NavLink className='createSpot' to='/spots/new'>List Your Property</NavLink>
        </span>
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      </>
    );
  } else {
    sessionLinks = (
      <li>
        <OpenModalButton
          buttonText="LOG IN"
          modalComponent={<LoginFormModal />}
        />
        <OpenModalButton
          buttonText="SIGN UP"
          modalComponent={<SignupFormModal />}
        />
      </li>
    );
  }

  const handleLogoClick = () => {
    history.push('/');
  };

  return (
    <>
    <ul className="navbarMain">
      <li>
        <h1 className='homeLogo' onClick={handleLogoClick}>SOJOURN</h1>
      </li>
      <div className='createAndSession'>
        {isLoaded && sessionLinks}
      </div>
    </ul>
    </>
  );
}

export default Navigation;
