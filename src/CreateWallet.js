import React, { useContext } from "react";
import { ScreenContext } from "./App";

const CreateWallet = () => {
  const screenContext = useContext(ScreenContext);
  console.log(screenContext);
  return <div></div>;
};

export default CreateWallet;
