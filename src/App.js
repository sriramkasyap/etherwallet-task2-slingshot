import { ChakraProvider, Button, Flex, Heading } from "@chakra-ui/react";
import { createContext } from "react";
import { useState } from "react";
import "./App.css";
import CreateWallet from "./singleWallet/CreateWallet";
import ImportWallet from "./singleWallet/ImportWallet";
import LoginScreen from "./singleWallet/LoginScreen";
import Onboarding from "./Onboarding";
import WalletScreen from "./singleWallet/WalletScreen";
import CreateHDWallet from "./hdwallet/CreateHDWallet";
const ScreenContext = createContext();

function App() {
  const [screen, setScreen] = useState("onboard");
  const [password, setPassword] = useState();
  const [currentWalletAddress, setCurrentWalletAddress] = useState();
  const [error, setError] = useState();

  // onboard ->  create -> wallet
  // onboard -> import -> wallet
  // onboard -> login -> wallet

  const logout = (e) => {
    e.preventDefault();
    setPassword("");
    setError("");
    setCurrentWalletAddress("");
    setScreen("onboard");
  };

  return (
    <ChakraProvider>
      <div className="App">
        <ScreenContext.Provider
          value={{
            screen,
            setScreen,
            password,
            setPassword,
            error,
            setError,
            currentWalletAddress,
            setCurrentWalletAddress,
          }}
        >
          <Flex justifyContent="flex-end" className="header">
            {screen !== "onboard" ? (
              <Button onClick={logout}>
                {currentWalletAddress && password ? "Logout" : "Home"}
              </Button>
            ) : (
              <></>
            )}
          </Flex>
          <Heading className="main-heading" textAlign="center">
            My Wallet App
          </Heading>
          {screen === "create" ? (
            <CreateWallet />
          ) : screen === "create-hd" ? (
            <CreateHDWallet isCreateView={true} />
          ) : screen === "import" ? (
            <ImportWallet />
          ) : screen === "import-hd" ? (
            <CreateHDWallet isCreateView={false} />
          ) : screen === "wallet" ? (
            <WalletScreen />
          ) : screen === "login" ? (
            <LoginScreen />
          ) : (
            <Onboarding />
          )}
        </ScreenContext.Provider>
      </div>
    </ChakraProvider>
  );
}

export default App;
export { ScreenContext };
