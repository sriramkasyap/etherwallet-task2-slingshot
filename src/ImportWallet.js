import React, { useContext } from "react";
import { ScreenContext } from "./App";

const ImportWallet = () => {
  const screenContext = useContext(ScreenContext);
  console.log(screenContext);
  return <div></div>;
};

export default ImportWallet;
