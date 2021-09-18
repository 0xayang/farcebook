import { useEffect, useState } from "react";
import {
  getCurrentWalletConnected,
  connectWallet,
  getAdmittedStatus,
  getSovereignName,
  takeThrone
} from "./util/interact.js";

const ThroneRoom = (props) => {
    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [isAdmitted, setIsAdmitted] = useState(false);
    const [thisSubject, setThisSubject] = useState({});
    const [sovereign, setSovereign] = useState("");
    const [crownUri, setCrownUri] = useState("");

    useEffect(async () => {
      const { address, status } = await getCurrentWalletConnected();
      setStatus(status);
  
      setWallet(address);
  
      const { isAdmitted, admittedStatus, thisSubject } = await getAdmittedStatus();
      setIsAdmitted(isAdmitted);
      setThisSubject(thisSubject);

      const sovereignName = await getSovereignName();
      setSovereign(sovereignName);

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

    const onTakeThroneButtonPressed = async () => {
        const takeThroneResponse = await takeThrone(crownUri);
        setStatus(takeThroneResponse.status);
    }
  
    function renderThroneRoom() {
        if (!window.ethereum) {
            return (<div>🦊 Connect to Metamask using the top right button.</div>)
        } else if (!isAdmitted) {
            return (<div>Only a subject may assume the throne</div>)
        } else {
            return (
                <div>
                  <div className="balance">balance: {thisSubject.balance}  sugar coins</div>
                  <div className="throne">
                    <h2>Assume the Throne</h2>
                    <div>Wear the crown, if you are worthy</div>
                    <br></br>
                    <div>Current Sovereign: {sovereign}</div>
                    <h3>Choose Your Crown: </h3>
                    <input
                        type="text"
                        placeholder="uri of your crown jpeg"
                        onChange={(event) => setCrownUri(event.target.value)}
                    />
                    <button id="mintButton" onClick={onTakeThroneButtonPressed}>
                        Take the Throne
                    </button>
                  </div>
                </div>
                )
        }
    }

    return (
      <div className="ThroneRoom">
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
        <h1 id="title">👑 The Throne</h1>
        <p>
          ASCEND THE HIGHEST REACHES OF POWER!
        </p>
        <div>{renderThroneRoom()}</div>
        <p id="status" style={{ color: "red" }}>
            {status}
        </p>
      </div>
    );
  };
  
  export default ThroneRoom;
