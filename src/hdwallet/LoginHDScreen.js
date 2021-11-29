import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Box, Flex, Heading } from "@chakra-ui/layout";
import { mnemonicToSeed } from "bip39";
import { AES, enc } from "crypto-js";
import { encrypt } from "crypto-js/aes";
import { hdkey } from "ethereumjs-wallet";
import { providers } from "ethers";
import React, { useContext, useState } from "react";
import { ScreenContext } from "../App";
import GeneratedWallet from "./GeneratedWallet";

const LoginHDScreen = () => {
  const { setError, error } = useContext(ScreenContext);
  const [passwordKey, setPasswordKey] = useState("");

  const [seed, setseed] = useState();
  const [wallets, setWallets] = useState([]);
  const [inProgress, setProgress] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setProgress(true);

    if (!(passwordKey && passwordKey.length > 0)) {
      setError("Please enter a passphrase");
      return;
    }

    let encryptedMnemonic = localStorage.getItem("hd_xpriv_encrypted");

    if (!(encryptedMnemonic && encryptedMnemonic.length > 0)) {
      setError("You have to Create / Import a seed phrase first!");
      return;
    }

    let walletCount = localStorage.getItem("hd_wallet_count");
    try {
      let mnemonic = AES.decrypt(encryptedMnemonic, passwordKey).toString(
        enc.Utf8
      );

      let xPriv = await mnemonicToSeed(mnemonic);
      await setseed(xPriv);

      walletCount = parseInt(walletCount) || 0;
      let allWallets = [];
      for (let i = 0; i < walletCount; i++) {
        allWallets.push(await generateNewWallet(i, xPriv));
      }
      setWallets(allWallets);

      setProgress(false);
    } catch (e) {
      setError("Decryption failed. Incorrect Password.");
    }
  };

  const generateNewWallet = async (index = 0, xPrivKey = seed) => {
    const hdwallet = hdkey.fromMasterSeed(xPrivKey);
    const path = "m/44'/60'/0'/0";
    const wallet = hdwallet.derivePath(path).deriveChild(index).getWallet();

    let provider = new providers.JsonRpcProvider(
      "https://rinkeby.infura.io/v3/a610e824d6bc4bef94728de6b76a098f"
    );

    let address = wallet.getAddressString();
    let balance = await provider.getBalance(address);
    let privateKey = wallet.getPrivateKeyString();

    let wallett = {
      address,
      publicKey: wallet.getPublicKeyString(),
      privateKey,
      balance,
    };

    let privateKeyEnc = encrypt(
      privateKey.substring(2),
      passwordKey
    ).toString();
    localStorage.setItem(address, privateKeyEnc);

    return wallett;
  };

  return (
    <Box maxW={600} m="10px auto" p="30px 0" className="login-screen">
      <Heading size="md" m="20px auto 50px" style={{ textAlign: "center" }}>
        HD Wallet
      </Heading>

      <p style={{ color: "red", margin: "0 0 20px" }}>{error}</p>

      {wallets && wallets.length > 0 ? (
        <>
          <GeneratedWallet
            wallets={wallets}
            generateNewWallet={generateNewWallet}
            setProgress={setProgress}
            inProgress={inProgress}
            passwordKey={passwordKey}
          />
        </>
      ) : (
        <form onSubmit={handleFormSubmit}>
          <Flex m="20px 0 10px" className="input-holder">
            <Input
              type="password"
              placeholder="Your Passphrase"
              name="passwordKey"
              value={passwordKey}
              required={true}
              onChange={(e) => setPasswordKey(e.target.value)}
            />
          </Flex>

          <Button disabled={inProgress} className="submit-button" type="submit">
            {inProgress ? "Logging in..." : "Login"}
          </Button>
        </form>
      )}
    </Box>
  );
};

export default LoginHDScreen;
