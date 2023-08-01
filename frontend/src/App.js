// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import AllSpots from "./components/Spots/AllSpotsPage";
import SpotDetails from "./components/SpotDetails";
import { ModalProvider } from "./context/Modal";
import SpotForm from "./components/CreateSpot";
import { useLocation } from "react-router-dom";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  const location = useLocation();

  useEffect(() => {
    console.log("Current Pathname:", location.pathname);
  }, [location]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded &&
      <Switch>
        <ModalProvider>
        <Route exact path='/'>
          <AllSpots />
        </Route>
        <Route exact path='/spots/new'>
          <SpotForm />
        </Route>
        <Route path='/spots/details/:spotId'>
          <SpotDetails />
        </Route>
      </ModalProvider>
      </Switch>}
    </>
  );
}

export default App;
