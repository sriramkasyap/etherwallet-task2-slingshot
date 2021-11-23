import { createContext } from "react";
import { useState } from "react";
import "./App.css";
import CreateWallet from "./CreateWallet";
import ImportWallet from "./ImportWallet";
import LoginScreen from "./LoginScreen";
import Onboarding from "./Onboarding";
import WalletScreen from "./WalletScreen";
const ScreenContext = createContext();

function App() {
  const [screen, setScreen] = useState("onboard");
  const [password, setPassword] = useState();
  const [error, setError] = useState();

  // onboard ->  create -> wallet
  // onboard -> import -> wallet
  // onboard -> login -> wallet

  const logout = (e) => {
    e.preventDefault();
    setPassword("");
    setScreen("onboard");
  };

  return (
    <div className="App">
      <ScreenContext.Provider
        value={{ screen, setScreen, password, setPassword, error, setError }}
      >
        <div className="header">
          {screen !== "onboard" ? (
            <button onClick={logout} className="logout-button">
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
        ) : screen === "wallet" ? (
          <WalletScreen />
        ) : screen === "login" ? (
          <LoginScreen />
        ) : (
          <Onboarding />
        )}
      </ScreenContext.Provider>
    </div>
  );
}

export default App;
export { ScreenContext };
