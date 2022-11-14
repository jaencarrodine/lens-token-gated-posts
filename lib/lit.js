import LitJsSdk from "@lit-protocol/sdk-browser";

const client = new LitJsSdk.LitNodeClient();
const chain = "mumbai";

// Checks if the user has at least 0.1 MATIC
const accessControlConditions = [
  {
    contractAddress: "",
    standardContractType: "",
    chain,
    method: "eth_getBalance",
    parameters: [":userAddress", "latest"],
    returnValueTest: {
      comparator: ">=",
      value: "100000000000000000", // 0.1 MATIC
    },
  },
];

class Lit {
  litNodeClient;

  async connect() {
    await client.connect();
    this.litNodeClient = client;
  }

  async encryptText(text, accessControlConditions, signData) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    //TODO use existing wallet connection to obtain the auth sig
    const sig = await signData.signMessageAsync()
   
    const authSig ={
      "sig": sig,
      "derivedVia": "web3.eth.personal.sign",
      "signedMessage": signData.message,
      "address": signData.userAddress
    } 
  
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(text);

    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions: accessControlConditions,
      symmetricKey,
      authSig,
      chain,
    });

    return {
        encryptedString,
        encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16")
    };
  }
  //encryptedBlob, encryptedSymmetricKey, accessControlConditions, signData
  async decryptText(encryptedString, encryptedSymmetricKey, accessControl, signData) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const accessConditions = accessControl || accessControlConditions;
    const sig = await signData.signMessageAsync()
    console.log(accessConditions)
    const authSig ={
      "sig": sig,
      "derivedVia": "web3.eth.personal.sign",
      "signedMessage": signData.message,
      "address": signData.userAddress
    } 
    const symmetricKey = await this.litNodeClient.getEncryptionKey({
        accessControlConditions: accessConditions,
        toDecrypt: encryptedSymmetricKey,
        chain,
        authSig
    });

    return await LitJsSdk.decryptString(
        encryptedString,
        symmetricKey
    );
  }
}

export default new Lit();