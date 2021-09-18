import { useEffect, useState } from "react";
import {
  getCurrentWalletConnected,
  connectWallet,
  getAdmittedStatus,
  doubleBalance,
  gamble
} from "./util/interact.js";

const Economy = (props) => {
    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [isAdmitted, setIsAdmitted] = useState(false);
    const [thisSubject, setThisSubject] = useState({});
    const [gambleAmount, setGambleAmount] = useState(0);

    useEffect(async () => {
      const { address, status } = await getCurrentWalletConnected();
      setStatus(status);
  
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

    const onDoubleBalanceButtonPressed = async () => {
        const { _, status } = await doubleBalance();
        setStatus(status)
    }

    const onGambleButtonPressed = async () => {
      const { _, status } = await gamble(gambleAmount);
      setStatus(status)
    }
  
    function renderEconomy() {
        if (!window.ethereum) {
            return (<div>🦊 Connect to Metamask using the top right button.</div>)
        } else if (!isAdmitted) {
            return (<div>Only subjects of the Kingdom may participate in the economy</div>)
        } else {
            return (
                <div>
                  <div className="balance">balance: {thisSubject.balance}  sugar coins</div>
                  <div className="labor">
                    <h2>✊ ⚒️️ 🧰 Labor:</h2>
                    <div>Exchange labor for income</div>
                    <br></br><br></br><br></br>
                    <button id="mintButton" onClick={onDoubleBalanceButtonPressed}>
                        Double Your Balance!
                    </button>
                  </div>
                  <div className="gamble">
                    <h2>🎰 Gamble:</h2>
                    <div>Take A Risk!</div>
                    <br></br>
                    <input
                        type="text"
                        placeholder="number of sugar coins to gamble"
                        onChange={(event) => setGambleAmount(event.target.value)}
                    />
                    <button id="mintButton" onClick={onGambleButtonPressed}>
                        Try Your Luck!
                    </button>
                  </div>
                </div>
                
                )
        }
    }

    return (
      <div className="Economy">
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
        <h1 id="title">🤑 The Economy</h1>
        <p>
          Accrue economic power in the economy of Farcebook
        </p>
        <div>{renderEconomy()}</div>
        <p id="status" style={{ color: "red" }}>
            {status}
        </p>
      </div>
    );
  };
  
  export default Economy;
