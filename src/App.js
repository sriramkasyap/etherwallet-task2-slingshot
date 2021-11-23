import { createContext } from "react";
import { useState } from "react";
import "./App.css";
import CreateWallet from "./CreateWallet";
import ImportWallet from "./ImportWallet";
import Onboarding from "./Onboarding";
const ScreenContext = createContext();

function App() {
  const [screen, setScreen] = useState("onboard");
  // onboard ->  create -> wallet
  // onboard -> import -> wallet
  // onboard -> login -> wallet

  return (
    <div className="App">
      <ScreenContext.Provider value={{ screen, setScreen }}>
        <div className="header">
          {screen !== "onboard" ? (
            <button
              onClick={() => setScreen("onboard")}
              className="logout-button"
            >
              Logout
            </button>
          ) : (
            <></>
          )}
        </div>
        <h1 className="main-heading">My Wallet App</h1>
        {screen === "create" ? (
          <CreateWallet />
        ) : screen === "import" ? (
          <ImportWallet />
        ) : screen === "login" ? (
          <ImportWallet />
        ) : (
          <Onboarding />
        )}
      </ScreenContext.Provider>
    </div>
  );
}

export default App;
export { ScreenContext };
