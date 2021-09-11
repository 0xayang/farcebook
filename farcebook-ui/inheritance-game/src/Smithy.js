import { useEffect, useState } from "react";
import {
  getCurrentWalletConnected,
  connectWallet,
  getAdmittedStatus,
  initiateSmith
} from "./util/interact.js";

const Smithy = (props) => {
    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [isAdmitted, setIsAdmitted] = useState(false);
    const [thisSubject, setThisSubject] = useState({});

    useEffect(async () => {
      const { address, status } = await getCurrentWalletConnected();
  
      setWallet(address);
  
      const { isAdmitted, admittedStatus, thisSubject } = await getAdmittedStatus();
      setIsAdmitted(isAdmitted);
      setThisSubject(thisSubject);

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

    function onMintItemButtonPressed() {}

    const onInitiateSmithButtonPressed = async () => {
      const initiateSmithResponse = await initiateSmith();
      const { _, __, thisSubject } = await getAdmittedStatus();
      setThisSubject(thisSubject);
    }
  
    function renderSmithy() {
        if (!window.ethereum) {
            return (<div>🦊 Connect to Metamask using the top right button.</div>)
        }else if (thisSubject.isSmith) {
            return (
            <div>
                <div>Welcome, Smith!</div>
                <form>
                <h2>🤔 Item Name: </h2>
                <input
                    type="text"
                    placeholder="e.g. air jordan concord 11"
                />
                </form>
                <div>{thisSubject.isSmith}</div>
                <p>
                <button id="mintButton" onClick={onMintItemButtonPressed}>
                    Mint Item
                </button>
                </p>
            </div>
            )
        } else {
            return (
                <div className="name">
                    <span>Only a Smith may mint items!</span>
                    <br></br>
                    <button id="mintButton" onClick={onInitiateSmithButtonPressed}>
                        Initiate Smith
                    </button>
                </div>
            )
        }
    }

    return (
      <div className="Smithy">
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
        <h1 id="title">🔨 The Smithy</h1>
        <p>
          Mint items for the people of Farcebook
        </p>
        <div>{renderSmithy()}</div>
      </div>
    );
  };
  
  export default Smithy;
