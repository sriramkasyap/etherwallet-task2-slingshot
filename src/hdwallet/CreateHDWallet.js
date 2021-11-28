import { Button } from "@chakra-ui/button";
import { Flex, Heading } from "@chakra-ui/layout";
import React, { useState } from "react";
import { generateMnemonic, mnemonicToSeed } from "bip39";
import { hdkey } from "ethereumjs-wallet";
import { encrypt } from "crypto-js/aes";
import GenerateSeed from "./GenerateSeed";
import GeneratedWallet from "./GeneratedWallet";

const CreateHDWallet = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordKey, setPasswordKey] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [seed, setseed] = useState();
  const [wallets, setWallets] = useState([]);

  const addWallet = (wallet) => {
    setWallets([
      ...wallets.filter((w) => w.address !== wallet.address),
      wallet,
    ]);
  };

  const createMnemonic = async (e) => {
    e.preventDefault();
    setMnemonic(generateMnemonic());
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!(passwordKey && passwordKey.length > 0)) {
      setErrorMessage("Please enter a passphrase");
      return;
    }
    let encrypted = encrypt(mnemonic, passwordKey).toString();
    localStorage.setItem("hd_xpriv_encrypted", encrypted);

    let xPriv = await mnemonicToSeed(mnemonic);
    await setseed(xPriv);

    generateNewWallet(0, xPriv);
  };

  const generateNewWallet = (index = 0, xPrivKey = seed) => {
    const hdwallet = hdkey.fromMasterSeed(xPrivKey);
    const path = "m/44'/60'/0'/0/0";
    const wallet = hdwallet.derivePath(path).deriveChild(index).getWallet();

    addWallet({
      address: wallet.getAddressString(),
      publicKey: wallet.getPublicKeyString(),
      privateKey: wallet.getPrivateKeyString(),
    });
  };

  return (
    <Flex
      direction="column"
      maxW="600"
      m="0 auto"
      className="create-wallet-screen"
      alignItems="center"
    >
      <Heading size="md" m="20px 0 40px">
        HD Wallet
      </Heading>

      {mnemonic && mnemonic.length > 0 ? (
        wallets && wallets.length > 0 ? (
          <>
            <GeneratedWallet
              wallets={wallets}
              generateNewWallet={generateNewWallet}
            />
          </>
        ) : (
          <GenerateSeed
            mnemonic={mnemonic}
            handleFormSubmit={handleFormSubmit}
            passwordKey={passwordKey}
            setPasswordKey={setPasswordKey}
            errorMessage={errorMessage}
          />
        )
      ) : (
        <>
          <Flex>
            <Button colorScheme="teal" onClick={createMnemonic}>
              Generate Seed phrase
            </Button>
          </Flex>
        </>
      )}
    </Flex>
  );
};

export default CreateHDWallet;
