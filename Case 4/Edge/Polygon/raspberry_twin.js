const axios = require('axios')
const FormData = require('form-data')
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path'); // Add the path module
const { exec } = require('child_process');

////////////////////////////////////////PUBLIC POLYGON CODE//////////////////////////////////////////////////////

const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CATALOG_CONTRACT_ADDRESS = process.env.CATALOG_CONTRACT_ADDRESS;

const catalogContractJson = require("./artifacts/contracts/Catalog.sol/Catalog.json");
const farmMenuContractAbi = require("./artifacts/contracts/Catalog.sol/FarmMenu.json");

const abi = catalogContractJson.abi;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const catalogContract = new ethers.Contract(CATALOG_CONTRACT_ADDRESS, abi, signer);

var count = 0;

const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3MTMxZTcwNi03N2ZlLTQ0MDctYWE5OC0xNDg4OTE2OGVkMTMiLCJlbWFpbCI6ImhlbmRyaWNrLmdvbmNhbHZlc0BlZHUucHVjcnMuYnIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNmI4OWNhZmU2NmQ3ZWNkYTQ1OTMiLCJzY29wZWRLZXlTZWNyZXQiOiJkYzFiM2I1NTdjNTVjYmJhNDRjZTQ5N2I3Y2NiNTNlMzQ1ODdmN2Y5MThjMmU3NzViZDI1MmQ2MjAyMTEwNDU4IiwiaWF0IjoxNzAwMDcxMjQ2fQ.dyLJcWzw9dcs7tEYu24q7QPZQ35eKphJgkDHPl3x5fA'
var fileContent = "";
var cnt = 0;
const fileName = 'ipfs_file.txt';

const FARM_ID = "1";
var farmOutputIpnsPk = "";
let farmSc = "";
let farmMenuContract;

////////////////////////////////////////PRIVATE ETHEREUM CODE/////////////////////////////////////////////////////

const privateProvider = new ethers.providers.JsonRpcProvider("http://192.168.0.11:8545");

// Read contract bytecode from file
const contractHex = fs.readFileSync('contractHex.txt', 'utf8');
const privContractAbi = [{"inputs":[{"internalType":"string","name":"_caralog_ipns_key","type":"string"}],"name":"setCatalogIpnsKey","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_output_ipns_key","type":"string"}],"name":"setOuputIpnsKey","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_sk_cid","type":"string"}],"name":"setPrivateKeyCid","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"catalogIpnsKey","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"outputIpnsKey","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"privateKeyCid","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}];
const contractInterface = new ethers.ContractFactory(privContractAbi, contractHex, privateProvider.getSigner());
let gtwCatalogContract;

async function deployContract() {
  try {
      // Deploy the contract
      gtwCatalogContract = await contractInterface.deploy();
      
      // Contract deployed successfully, you can access its address and other details
      console.log('Contract deployed at address:', gtwCatalogContract.address);
      return gtwCatalogContract.address;
  } catch (error) {
      console.error('Error deploying contract:', error);
      return null;
  }
}

async function checkPrivateCatalog(ipfs) {
  var privateKeyCid = await gtwCatalogContract.privateKeyCid();
  console.log("PrivateKey: ", privateKeyCid);

  var keyExists = false;
  var key = "";

  if(privateKeyCid == '') {
    const privateScIpnsSk = 'IpnsSecretKey'; //ipns key name

    keyExists = await checkIPNSKeyNameExists(ipfs, privateScIpnsSk);

    if(keyExists == false) {
      console.log("Generating a new IPNS key for Gateway Catalog...");
      key = await ipfs.key.gen(privateScIpnsSk, { type: 'rsa', size: 2048 });
    } else{
      const keys = await ipfs.key.list();
      key = keys.find((k) => k.name === privateScIpnsSk);
    }

    //const exportedKey = await ipfs.key.export(privateScIpnsSk);
    const tmpKey = await exportKey(privateScIpnsSk);
    const tmpPath = 'exportedKey.key';
    const exportedKey = await readFileAndDecode(tmpPath);

    var ipfs_cid = await addIpfsFile(exportedKey);

    var tx = await gtwCatalogContract.setOuputIpnsKey(ipfs_cid);
    
    // Wait for the transaction to be mined
    await tx.wait();

    var ipfs_cid = await addIpfsFile("-1;-1;-1;-1;-1;-1");
  
    //populate this IPNS key
    await publishToIpns(ipfs, ipfs_cid, privateScIpnsSk, 30000);

    tx = await gtwCatalogContract.setCatalogIpnsKey(key.id);
    await tx.wait();
  }
  
  var outputIpnsKey = await gtwCatalogContract.outputIpnsKey();
  console.log("OutputIpnsKey: ", outputIpnsKey);

  if(outputIpnsKey == '') {
    const outputIpnsKey = 'PrivateOutputIpnsKey'; //ipns public key name

    keyExists = await checkIPNSKeyNameExists(ipfs, outputIpnsKey);

    if(keyExists == false) {
      console.log("Generating a new Private Output IPNS key for Gateway Catalog...");
      key = await ipfs.key.gen(outputIpnsKey, { type: 'rsa', size: 2048 });
    } else{
      const keys = await ipfs.key.list();
      key = keys.find((k) => k.name === outputIpnsKey);
    }

    tx = await gtwCatalogContract.setOuputIpnsKey(key.id);
    await tx.wait();
  }
}




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////PUBLIC POLYGON CODE//////////////////////////////////////////////////////

function readFileAndDecode(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(`Error reading file: ${err}`);
        return;
      }

      // Convert file contents to a human-readable format
      const decodedData = data.toString('base64');

      resolve(decodedData);
    });
  });
}

async function exportKey(keyName) {
  return new Promise((resolve, reject) => {
    const command = `ipfs key export ${keyName} -o exportedKey.key`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error executing command: ${error.message}`);
        return;
      }

      if (stderr) {
        reject(`Command error: ${stderr}`);
        return;
      }

      const exportedKey = stdout.trim();
      resolve(exportedKey);
    });
  });
}

const writeToFile = (filePath, content) => {
  return new Promise((resolve, reject) => {
      fs.writeFile(filePath, content, (err) => {
          if (err) {
              reject(err);
          } else {
              resolve();
          }
      });
  });
};

async function publishToIpns(ipfs, cid, keyName, timeout_ms) {

  //const options = { key: keyName }; 

  while(true) {
    try { 
      //console.log(`Publishing [${cid}] to ${keyName}`);
      console.log("\nPublishing cid: ", cid);
      console.log("To: ", keyName);
      const result = await ipfs.name.publish(cid, { key: keyName });
      console.log("Published to Catalog IPNS result: ", result);
      break;

    } catch(error) {
      console.log("Error: ",  error);
      console.log("Error publishing to IPNS! Trying again...");
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
}

async function checkIPNSKeyNameExists(ipfs, keyName) {
  console.log("Checking if IPNS key exists...");
  try {
    const keys = await ipfs.key.list();
    const keyExists = keys.some((key) => key.name === keyName);

    return keyExists;
  } catch (error) {
    // An error occurred while retrieving the keys, which indicates
    // that the key does not exist.
    return false;
  }
}

async function addIpfsFile(fileContent) {
  const formData = new FormData();
  const filePath = path.join(__dirname, fileName);

  console.log('Adding file to IPFS...');

  await writeToFile(filePath, fileContent);
  cnt += 1;
  
  const fileStream = fs.createReadStream(filePath);

  formData.append('file', fileStream);
  const pinataMetadata = JSON.stringify({ name: 'ipfs_file' });
  formData.append('pinataMetadata', pinataMetadata);

  const pinataOptions = JSON.stringify({ cidVersion: 0 });
  formData.append('pinataOptions', pinataOptions);

    try {
      const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
          headers: {
              ...formData.getHeaders(),
              Authorization: `Bearer ${JWT}`,
          },
      });

      console.log(response.data);

      return response.data.IpfsHash;

  } catch (error) {
      console.error('Error pinning file to IPFS:', error);
  }
}

async function checkIPNSKeyNameExists(ipfs, keyName) {
  console.log("Checking if IPNS key exists...");
  try {
    const keys = await ipfs.key.list();
    const keyExists = keys.some((key) => key.name === keyName);

    return keyExists;
  } catch (error) {
    // An error occurred while retrieving the keys, which indicates
    // that the key does not exist.
    return false;
  }
}

async function publishToIpns(ipfs, cid, keyName, timeout_ms) {

  while(true) {
    try { 
      console.log("\nPublishing cid: ", cid);
      console.log("To: ", keyName);
      const result = await ipfs.name.publish(cid, { key: keyName });
      console.log("Published to Catalog IPNS result: ", result);
      break;

    } catch(error) {
      console.log("Error: ",  error);
      console.log("Error publishing to IPNS! Trying again...");
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
}

async function waitForAddressEvent() {
  const eventName = 'FarmCreated';

  console.log('Waiting for SC Address event...');

  return new Promise((resolve, reject) => {
    catalogContract.on(eventName, (farmScAddr) => {
      catalogContract.removeAllListeners(eventName); // Remove the event listener after the event is detected
      resolve(farmScAddr);
    });
  });
}

async function createKeyFile(base64Key, filePath) {
  // Decode the base64 key
  const keyBuffer = Buffer.from(base64Key, 'base64');

  // Write the key buffer to the file
  try {
    await fs.promises.writeFile(filePath, keyBuffer);
    console.log(`Key file created: ${filePath}`);
  } catch (error) {
    console.error('Error creating key file:', error);
  }
}

async function importKey(keyName, keyFile) {
  return new Promise((resolve, reject) => {
    const command = `ipfs key import ${keyName} ./${keyFile}.key`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error executing command: ${error.message}`);
        return;
      }

      if (stderr) {
        reject(`Command error: ${stderr}`);
        return;
      }

      const importedKey = stdout.trim();
      
      resolve(importedKey);
    });
  });
}

async function importFarmMenuIpnsKeyName(ipfs) {
  const secretKeyCid = await catalogContract.farmMenuListSecretKey(); 

  console.log("Secret key CID: ", secretKeyCid);

  const data = ipfs.cat(secretKeyCid);
  const metadata_chunks = []
  for await (const chunk of data) {
      metadata_chunks.push(chunk)
  }
  
  const exportedKey = Buffer.concat(metadata_chunks).toString()
  console.log("Key exported...");

  const clone = "FarmMenuListSecretKey_Farm" + FARM_ID;
  console.log("Checking if keye exist ...");
  keyExists = await checkIPNSKeyNameExists(ipfs, clone);

  if(keyExists == false) {
    //const key = await ipfs.key.import(clone, exportedKey, '123456');
    const keyFile = clone;
    console.log("Creating key file...");
    await createKeyFile(exportedKey, `${keyFile}.key`);
    console.log("Importing key...");
    const key = await importKey(clone, keyFile);

    console.log("\nKey imported: ", key);
    return key;
  }

  return clone;
}

async function checkFarmIpnsKey(ipfs, farmMenuListIpnsKey) {
  let cid;

  //cid = await getLastIpnsData(ipfs.name.resolve(`/ipns/${farmMenuListIpnsKey}`));
  for await (const name of ipfs.name.resolve(`/ipns/${farmMenuListIpnsKey}`)) {
    cid = name;
  }
  console.log("CID: ", cid.replace('/ipfs/', ''));

  var contentString = "";

  //verifica se a farm já possui um IPNS key para ela
  while(contentString != "-1;-1;-1;-1;-1;-1") {
    const data = ipfs.cat(cid);
    const metadata_chunks = []
    for await (const chunk of data) {
        metadata_chunks.push(chunk)
    }
    contentString = Buffer.concat(metadata_chunks).toString()
    console.log("IPFS output: ", contentString);

    const ipfsContentList = contentString.split(';');

    //check of this device already has its own IPNS key
    if(ipfsContentList[0] == FARM_ID) {
      console.log("This FARM already has its IPNS key!");
      
      //stores the FarmMenu SC to the respective variable
      farmSc = ipfsContentList[1];
      return true;
    }

    cid = ipfsContentList[2];
  }

  console.log("This FARM doesnt have its IPNS key!");

  return false
}

async function generateFarmIpnsKey(ipfs) {
  var keyExists = false;
  var key = "";

  var farmIpnsKey = "Farm" + FARM_ID + 'IpnsKey'; //ipns key name para estar farm
  console.log("FarmIpnsKey: ", farmIpnsKey);

  keyExists = await checkIPNSKeyNameExists(ipfs, farmIpnsKey);
  if(keyExists == false) {
    console.log(`Generating a new IPNS key for FARM${FARM_ID}...`);
    key = await ipfs.key.gen(farmIpnsKey, { type: 'rsa', size: 2048 });
  } else{
    const keys = await ipfs.key.list();
    key = keys.find((k) => k.name === farmIpnsKey);
  }

  const ipfs_cid = await addIpfsFile("-1;-1;-1;-1;-1;-1");

  //populate this IPNS key
  await publishToIpns(ipfs, ipfs_cid, farmIpnsKey, 30000);

  return key.id; //retorna o ID da chave onde vai ser enviado o conteúdo dessa farm
}

async function checkPublicCatalog(ipfs) {
  var farmMenuListIpnsKey = await catalogContract.farmMenuListIpnsKey(); //verifica se a lista de farms nao existe
  console.log("FarmMenuListIpnsKey: ", farmMenuListIpnsKey);

  try {
    if(farmMenuListIpnsKey == '') { //se nao existe
      
      const catalogKeyName = 'PublicFarmMenuList'; //ipns key name para onde a lista de farms será armazenada

      var key = "";
      const keyExists = await checkIPNSKeyNameExists(ipfs, catalogKeyName);

      if(keyExists == false) {
        console.log("Generating a new IPNS public key for CSC...");
        key = await ipfs.key.gen(catalogKeyName, { type: 'rsa', size: 2048 }); //gera a chave
      } else{
        const keys = await ipfs.key.list();
        key = keys.find((k) => k.name === catalogKeyName); //procura a chave, caso ela exista
      }
    
      var ipfs_cid = await addIpfsFile("-1;-1;-1;-1;-1;-1");
    
      //populate this IPNS key with a first value
      await publishToIpns(ipfs, ipfs_cid, catalogKeyName, 30000);

      farmMenuListIpnsKey = key.id;

      console.log("Sending key IPNS Public key to Catalog SC: ", key.id);
      var tx = await catalogContract.setFarmMenuListIpnsKey(key.id); //manda a chave gerada para o SC
      await tx.wait();
      console.log("Transaction done!");
      
      await exportKey(catalogKeyName);
      const tmpPath = 'exportedKey.key';
      const exportedKey = await readFileAndDecode(tmpPath);

      ipfs_cid = await addIpfsFile(exportedKey);

      tx = await catalogContract.setFarmMenuListSecretKey(ipfs_cid); //armazena chave privada no SC
      await tx.wait();
      console.log("Transaction done!");
      
    }
  } catch(error) {
    console.log("Error catched: ", error);
    //console.log("Catalog Key Name already exist!");
  }

  //verifica se esta farm existe na lista de farms disponivel
  const farmExist = await checkFarmIpnsKey(ipfs, farmMenuListIpnsKey);
  if(!farmExist) {
    farmOutputIpnsPk = await generateFarmIpnsKey(ipfs);

    ////////////////////////////////////////////////
    console.log("Creating Farm Smart Contract...");
    await catalogContract.createFarm(FARM_ID, farmOutputIpnsPk); //gera o seu SC e salve a chave IPNS onde os dados requisitados desta fazenda serao enviados

    farmSc = await waitForAddressEvent();
    console.log("Farm SC: ", farmSc);

    //////////////////////////////////////
    const ipnsName = '/ipns/' + farmMenuListIpnsKey;
    let ipfsCid;

    //busca pelo ultimo elemento da fila
    console.log("IpnsName: ", ipnsName);
    for await (const name of ipfs.name.resolve(ipnsName)) {
      ipfsCid = name;
    }

    const metadata = FARM_ID + ';' + farmSc + ';' + ipfsCid.replace('/ipfs/', '');
    console.log(`Storing FARM${FARM_ID} key: `, metadata);
    ipfs_cid = await addIpfsFile(metadata);

    console.log("CID1: ", ipfs_cid);
    //importa a chave para poder alterar o seu conteudo
    const farmMenuListIpnsKeyName = await importFarmMenuIpnsKeyName(ipfs);
    //publica esta chave IPNS gerada na lista de chaves do Catalog SC
    await publishToIpns(ipfs, ipfs_cid, farmMenuListIpnsKeyName, 5000); 
  
  } 
  
  //APENAS PARA TESTE, TIRAR ISSO DEPOIS
  if(farmSc == "") {
    // farmSc = "0x2D951a5F279D97ac7Ec246f6beeed2d603833fD3";
    console.log("ERROR! FARMSC DOES NOT HAVE ANY ADDRESS!");
  }

  console.log("My Farm SC: ", farmSc);
  farmMenuContract = new ethers.Contract(farmSc, farmMenuContractAbi.abi, signer);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function node_fsm() {
  const { create } = await import('ipfs-http-client');
  const ipfs = await create({ url: 'http://127.0.0.1:5001'});

  await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait for 5 seconds

  await checkPublicCatalog(ipfs);
  
  const privateScAddr = await deployContract();
  if(privateScAddr) {
    await checkPrivateCatalog(ipfs);
  }

  console.log("Everything ready!");

  while (true) {
    // await update_sc();
    // await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait for 10 seconds
    await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait for 10 seconds
  }
}

node_fsm();
