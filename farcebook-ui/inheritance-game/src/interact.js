import { pinJSONToIPFS } from "./pinata.js";
require("dotenv").config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const contractABI = require("../contract-abi.json");
const contractAddress = "0x44fe7B6e4E686b84CED262b0bA51eDD2debc7ca9";
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

export const takeThrone = async (crownUri) => {
  if (crownUri.trim() == "") {
    return {
      success: false,
      status: "❗Make sure to set a URI for your crown NFT!",
    };
  }
  window.contract = await loadContract();

  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data:  window.contract.methods
      .nameHeir(window.ethereum.selectedAddress, crownUri)
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" +
        txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
    };
  }
};

export const getSovereignName = async () => {
  window.contract = await loadContract();
  const sovereignName = await window.contract.methods.sovereignName().call();
  return sovereignName;
};

export const equipItem = async (itemId, subject) => {
  const item = await getItem(itemId);
  console.log(item);
  console.log(subject);
  var alreadyEquipped = false;
  switch (item.itemType) {
    case '0':
      return {
        success: false,
        status: "Can't equip nothing!",
      }
    case '1': // boots
      if (subject.boots == itemId) {
        alreadyEquipped = true;
      }
      break;
    case '2': // pants
        if (subject.pants == itemId) {
          alreadyEquipped = true;
        }
        break;
    case '3': // helmet
        if (subject.helmet == itemId) {
          alreadyEquipped = true;
        }
        break;
    case '4': // armor
      console.log("item is armor");
      if (subject.armor == itemId) {
        console.log("armor already equipped");
        alreadyEquipped = true;
      }
      break;
    case '5': // weapon
      if (subject.weapon == itemId) {
        alreadyEquipped = true;
      }
      break;
  }
  if (alreadyEquipped) {
    return {
      success: false,
      status: "Item already equipped!",
    }
  }
  window.contract = await loadContract();
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods
      .equipItem(itemId)
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" +
        txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
    };
  }
};

export const getItem = async (itemId) => {
  window.contract = await loadContract();
  try {
    const item = await window.contract.methods.items(itemId).call();
    return item;
  } catch (error) {
    return {};
  }
};

export const getItemName = async (itemId) => {
  try {
    const item = await getItem(itemId);
    return item.name;
  } catch (error) {
    return 'nothing';
  }
};

export const mintItem = async (itemName, itemDescription, itemTypeString, itemCost) => {
  if (itemName.trim() == "" | itemDescription.trim() == "" | itemCost < 0) {
    return {
      success: false,
      status: "❗Please make sure all fields are completed correctly before minting.",
    };
  }
  const itemType = parseInt(itemTypeString);
  if (itemType < 1 || itemType > 5) {
    return {
      success: false,
      status: "❗Please select a valid item type.",
    };
  }

  window.contract = await loadContract();

  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods
      .createItem(itemName, itemDescription, itemType, itemCost)
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" +
        txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
    };
  }
};

export const gamble = async (gambleAmount) => {
  window.contract = await loadContract();
  
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods
      .gambleSugarCoins(gambleAmount)
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" +
        txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
    };
  }
}

export const doubleBalance = async () => {
  window.contract = await loadContract();
  
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods
      .doubleSugarCoins()
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" +
        txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
    };
  }
}

export const initiateSmith = async () => {
  window.contract = await loadContract();
  
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods
      .initiateSmith()
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" +
        txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
    };
  }
}

export const getAdmittedStatus = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        window.contract = await loadContract();
        try {
          const subject =
            await window.contract.methods.subjects(window.ethereum.selectedAddress).call();
          if (subject.exists) {
            return {
              isAdmitted: true,
              admittedStatus: "User is a subject of the kingdom of Farcebook",
              thisSubject: subject,
            }
          } else {
            return {
              isAdmitted: false,
              admittedStatus: "User is not yet a subject of the kingdom of Farcebook",
              thisSubject: {},
            }
          }
        } catch (error) {
          return {
            isAdmitted: false,
            admittedStatus: "😥 Something went wrong: " + error.message,
            thisSubject: {},
          };
        }
        
      } else {
        return {
          isAdmitted: false,
          admittedStatus: "🦊 Connect to Metamask using the top right button.",
          thisSubject: {},
        };
      }
    } catch (err) {
      return {
        isAdmitted: false,
        admittedStatus: "😥 " + err.message,
        thisSubject: {},
      };
    }
  } else {
    return {
      isAdmitted: false,
      admittedStatus: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
      thisSubject: {},
    };
  }
}

export const admitSubject = async (name) => {
  if (name.trim() == "") {
    return {
      success: false,
      status: "❗Please make sure all fields are completed before minting.",
    };
  }
  window.contract = await loadContract();

  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods
      .admitSubject(name)
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" +
        txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
    };
  }
};

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "👆🏽 Write a message in the text-field above.",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆🏽 Write a message in the text-field above.",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

async function loadContract() {
  return new web3.eth.Contract(contractABI, contractAddress);
}
