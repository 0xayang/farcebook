import { useEffect, useState } from "react";
import {
  connectWallet,
  getCurrentWalletConnected,
  admitSubject,
  getAdmittedStatus,
  getItemName
} from "./util/interact.js";

const InheritanceGame = (props) => {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [isAdmitted, setIsAdmitted] = useState(false);
  const [admittedStatus, setAdmittedStatus] = useState("");
  const [name, setName] = useState("");
  const [bootsName, setBootsName] = useState("");
  const [pantsName, setPantsName] = useState("");
  const [armorName, setArmorName] = useState("");
  const [helmetName, setHelmetName] = useState("");
  const [weaponName, setWeaponName] = useState("");
  const [thisSubject, setThisSubject] = useState({});

  useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();

    setWallet(address);
    setStatus(status);

    const { isAdmitted, admittedStatus, thisSubject } = await getAdmittedStatus();
    setIsAdmitted(isAdmitted);
    setAdmittedStatus(admittedStatus);
    setThisSubject(thisSubject);

    setBootsName(await getItemName(thisSubject.boots));
    setPantsName(await getItemName(thisSubject.pants));
    setArmorName(await getItemName(thisSubject.armor));
    setHelmetName(await getItemName(thisSubject.helmet));
    setWeaponName(await getItemName(thisSubject.weapon));

    addWalletListener();
  }, []);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onAdmitSubjectPressed = async () => {
    if (isAdmitted) {
      // Subject is already admitted; do nothing instead of allowing user to
      // send a transaction that will fail.
      return;
    }
    const admitSubjectResponse = await admitSubject(name);
    setAdmittedStatus(admitSubjectResponse.admittedStatus);
  }

  function displaySubject() {
    if (!isAdmitted) {
      return (
        <form>
          <h2>🤔 Name: </h2>
          <input
            type="text"
            placeholder="e.g. ser edvard of saverin!"
            onChange={(event) => setName(event.target.value)}
          />
        </form>
        );
    }
    return (
      <div>
        <br></br>
        <div className="name">{thisSubject.name}</div>
        <div className="equipment">boots: {bootsName}</div>
        <div className="equipment">pants: {pantsName}</div>
        <div className="equipment">armor: {armorName}</div>
        <div className="equipment">helmet: {helmetName}</div>
        <div className="equipment">weapon: {weaponName}</div>
        <div className="balance">balance: {thisSubject.balance} sugar coins</div>
      </div>
    )
  }

  return (
    <div className="InheritanceGame">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>
      <h1 id="title">🧙‍♂️ Farcebook Inheritance Game</h1>
      <p>
        Who shall be the new sovereign of the Kingdom of Farcebook?
      </p>
      <div>{admittedStatus}</div>
      <div>{displaySubject()}</div>
      <p>
        <button id="mintButton" onClick={onAdmitSubjectPressed}>

          {isAdmitted ? (
            <span>Subject is admitted</span>
          ) : (
            <span>Create a name and admit subject</span>
          )}
        </button>
      </p>
      <p id="status" style={{ color: "red" }}>
        {status}
      </p>
    </div>
  );
};

export default InheritanceGame;
