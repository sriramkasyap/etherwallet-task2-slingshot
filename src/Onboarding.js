import React, { useContext } from "react";
import { ScreenContext } from "./App";

const Onboarding = () => {
  const { setScreen } = useContext(ScreenContext);
  return (
    <div className="onboarding">
      <h2>Howdy!</h2>

      <p>What would you like to Do? </p>

      <button onClick={() => setScreen("login")}>Login</button>
      <br />
      <br />
      <button onClick={() => setScreen("create")}>Create New Wallet</button>
      <br />
      <br />
      <button onClick={() => setScreen("import")}>Import Wallet</button>
    </div>
  );
};

export default Onboarding;
