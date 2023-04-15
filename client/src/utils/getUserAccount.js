import { ethers } from "ethers";

const getUserAccount = async () => {
  try {
    if (!window.ethereum) {
      alert("No crypto wallet found. Please install it.");
      throw new Error("No crypto wallet found. Please install it.");
    }

    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    return {
      address,
    };
  } catch (err) {
    alert("Something went wrong. Try again.");
    throw err;
  }
};

export default getUserAccount;
