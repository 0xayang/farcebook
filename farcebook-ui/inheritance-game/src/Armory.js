import { useEffect, useState } from "react";
import {
  getCurrentWalletConnected,
  connectWallet,
  getAdmittedStatus,
  getItem,
  equipItem
} from "./util/interact.js";

const Armory = (props) => {
    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [searchItemId, setSearchItemId] = useState(0);
    const [isAdmitted, setIsAdmitted] = useState(false);
    const [thisSubject, setThisSubject] = useState({});
    const [boots, setBoots] = useState({});
    const [pants, setPants] = useState({});
    const [armor, setArmor] = useState({});
    const [helmet, setHelmet] = useState({});
    const [weapon, setWeapon] = useState({});
    const [searchedItem, setSearchedItem] = useState({});

    useEffect(async () => {
      const { address, status } = await getCurrentWalletConnected();
      setStatus(status);
  
      setWallet(address);
  
      const { isAdmitted, admittedStatus, thisSubject } = await getAdmittedStatus();
      setIsAdmitted(isAdmitted);
      setThisSubject(thisSubject);

      if (isAdmitted) {
          setBoots(await getItem(thisSubject.boots));
          setPants(await getItem(thisSubject.pants));
          setArmor(await getItem(thisSubject.armor));
          setHelmet(await getItem(thisSubject.helmet));
          setWeapon(await getItem(thisSubject.weapon));
      }

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

    function renderItem (item) {
        if (!('name' in item) || !('description' in item)) {
            return;
        }
        return (
            <span>
                <span>{item.name}: </span>
                <span>{item.description}</span>
            </span>);
    }

    const onSearchButtonPressed  = async () => {
        const item = await getItem(searchItemId);
        console.log("searched");
        setSearchedItem(item);
    }

    const onEquipButtonPressed  = async () => {
        const {success, status} = await equipItem(searchItemId, thisSubject);
        setStatus(status);
    }
  
    function renderArmory() {
        if (!window.ethereum) {
            return (<div>🦊 Connect to Metamask using the top right button.</div>)
        } else if (!isAdmitted) {
            return (<div>Only subjects of the Kingdom are worthy of its items</div>)
        } else {
            return (
                <div>
                  <div className="balance">balance: {thisSubject.balance}  sugar coins</div>
                  <div className="equipment">
                    <h2>Current Loadout:</h2>
                    <div>🥾 {renderItem(boots)}</div>
                    <div>👖 {renderItem(pants)}</div>
                    <div>🧢 {renderItem(helmet)}</div>
                    <div>🛡️ {renderItem(armor)}</div>
                    <div>⚔️ {renderItem(weapon)}</div>
                  </div>
                  <div className="lookup-item">
                    <h2>📙 Equip Items:</h2>
                    <input
                        type="text"
                        placeholder="item id, e.g. 1"
                        onChange={(event) => setSearchItemId(event.target.value)}
                    />
                    <button id="mintButton" onClick={onSearchButtonPressed}>
                        Search Item
                    </button>
                    <br></br><br></br><br></br>
                    <div>{renderItem(searchedItem)}</div>
                    <div className="equip-item">
                        <button id="mintButton" onClick={onEquipButtonPressed}>
                            Equip Searched Item
                        </button>
                    </div>
                  </div>
                </div>
                
                )
        }
    }

    return (
      <div className="Armory">
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
        <h1 id="title">⚔️ The Armory</h1>
        <p>
          Equip yourself for the battles to come
        </p>
        <div>{renderArmory()}</div>
        <p id="status" style={{ color: "red" }}>
            {status}
        </p>
      </div>
    );
  };
  
  export default Armory;
