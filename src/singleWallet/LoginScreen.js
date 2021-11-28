import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Box, Flex, Heading, Stack } from "@chakra-ui/layout";
import { Radio, RadioGroup } from "@chakra-ui/radio";
import { AES, enc } from "crypto-js";
import { ethers } from "ethers";
import React, { useContext, useState } from "react";
import { ScreenContext } from "../App";

const LoginScreen = () => {
  const { setPassword, setScreen, setError, error, setCurrentWalletAddress } =
    useContext(ScreenContext);
  const [passwordKey, setPasswordKey] = useState("");
  const [existingWallets, setExistingWallets] = useState([]);
  const [walletAddress, setWwalletAddress] = useState();
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!(walletAddress && walletAddress.length > 0)) {
      setError("Please select a wallet to login");
      return;
    }

    let encryptedPKey = localStorage.getItem(walletAddress);
    try {
      let pKey = AES.decrypt(encryptedPKey, passwordKey).toString(enc.Utf8);

      let wallet = new ethers.Wallet(pKey);

      setError("");

      setCurrentWalletAddress(wallet.address);

      setPassword(passwordKey);

      setScreen("wallet");
    } catch (e) {
      setError("Decryption failed. Incorrect Password.");
    }
  };

  const refreshWallets = () => {
    setExistingWallets(
      JSON.parse(localStorage.getItem("ss_saved_wallets")) || []
    );
  };

  React.useEffect(refreshWallets, []);

  const removeAccount = (ew) => {
    localStorage.setItem(
      "ss_saved_wallets",
      JSON.stringify(existingWallets.filter((w) => w !== ew))
    );

    localStorage.removeItem(ew);
    refreshWallets();
  };

  return (
    <Box maxW={600} m="10px auto" p="30px 0" className="login-screen">
      <Heading size="md" m="20px auto 50px" style={{ textAlign: "center" }}>
        Select your wallet Address
      </Heading>

      <p style={{ color: "red", margin: "0 0 20px" }}>{error}</p>

      <form onSubmit={handleFormSubmit}>
        <RadioGroup onChange={setWwalletAddress} value={walletAddress}>
          <Stack direction="column">
            {existingWallets.map((ew, i) => (
              <Flex key={i}>
                <Radio
                  marginRight="10"
                  name="walletAddress"
                  value={ew}
                  title={ew}
                >
                  {ew}
                </Radio>
                <Button onClick={(e) => removeAccount(ew)} variant="link">
                  Remove
                </Button>
              </Flex>
            ))}
          </Stack>
        </RadioGroup>
        <Flex m="20px 0 10px" className="input-holder">
          <Input
            type="password"
            placeholder="Your Wallet Password"
            name="passwordKey"
            value={passwordKey}
            required={true}
            onChange={(e) => setPasswordKey(e.target.value)}
          />
        </Flex>

        <Button className="submit-button" type="submit">
          Login
        </Button>
      </form>
    </Box>
  );
};

export default LoginScreen;
