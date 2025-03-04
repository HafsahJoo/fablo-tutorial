/**
 * This module handles the connection to the Fabric network.
 * It provides methods to connect to the network and interact with chaincodes.
 */

const fs = require('fs');
const path = require('path');
const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const logger = require('../config/logger');

// Hardcode paths for troubleshooting
const WALLET_PATH = path.resolve(__dirname, '../../wallets');
const CONNECTION_PROFILE_PATH = path.resolve(__dirname, '../../../fablo-target/fabric-config/connection-profiles/connection-profile-org1.json');

async function initializeWallet() {
  try {
    console.log('Environment variables:');
    console.log('FABRIC_CONNECTION_PROFILE_PATH:', process.env.FABRIC_CONNECTION_PROFILE_PATH);
    console.log('FABRIC_WALLET_PATH:', process.env.FABRIC_WALLET_PATH);
    console.log('FABRIC_MSP_ID:', process.env.FABRIC_MSP_ID);
    console.log('FABRIC_CHANNEL_NAME:', process.env.FABRIC_CHANNEL_NAME);
    console.log('FABRIC_CHAINCODE_NAME:', process.env.FABRIC_CHAINCODE_NAME);
    console.log('FABRIC_ADMIN_USER:', process.env.FABRIC_ADMIN_USER);
    
    // Use hardcoded paths for now
    console.log('Using hardcoded wallet path:', WALLET_PATH);
    
    // Create wallet directory if it doesn't exist
    if (!fs.existsSync(WALLET_PATH)) {
      console.log('Creating wallet directory...');
      fs.mkdirSync(WALLET_PATH, { recursive: true });
    }
    
    // Check if connection profile exists
    console.log('Connection profile path:', CONNECTION_PROFILE_PATH);
    console.log('Connection profile exists:', fs.existsSync(CONNECTION_PROFILE_PATH));
    
    if (!fs.existsSync(CONNECTION_PROFILE_PATH)) {
      throw new Error(`Connection profile not found at ${CONNECTION_PROFILE_PATH}`);
    }
    
    // Create wallet
    const wallet = await Wallets.newFileSystemWallet(WALLET_PATH);
    logger.info(`Wallet path: ${WALLET_PATH}`);

    // Check if admin is already enrolled
    const identity = await wallet.get(process.env.FABRIC_ADMIN_USER || 'admin');
    if (identity) {
      logger.info(`Admin user identity already exists in the wallet`);
      return wallet;
    }

    // Load the connection profile
    const connectionProfileBuffer = fs.readFileSync(CONNECTION_PROFILE_PATH, 'utf8');
    const connectionProfile = JSON.parse(connectionProfileBuffer);
    console.log('Successfully loaded connection profile');
    
    // Get CA information
    const caInfo = connectionProfile.certificateAuthorities['ca.org1.example.com'];
    if (!caInfo) {
      throw new Error('No CA info found for ca.org1.example.com in the connection profile');
    }
    
    const caURL = caInfo.url;
    console.log('CA URL:', caURL);
    
    // Create a new CA client for interacting with the CA
    const ca = new FabricCAServices(caURL);

    // Enroll the admin user
    const adminUser = process.env.FABRIC_ADMIN_USER || 'admin';
    const adminPassword = process.env.FABRIC_ADMIN_PASSWORD || 'adminpw';
    
    console.log(`Enrolling admin user: ${adminUser}`);
    const enrollment = await ca.enroll({
      enrollmentID: adminUser,
      enrollmentSecret: adminPassword
    });

    // Import the identity into the wallet
    const mspId = process.env.FABRIC_MSP_ID || 'Org1MSP';
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId,
      type: 'X.509',
    };
    
    await wallet.put(adminUser, x509Identity);
    logger.info(`Successfully enrolled admin user and imported it into the wallet`);
    
    return wallet;
  } catch (error) {
    console.error('Detailed error:', error);
    logger.error(`Failed to initialize wallet: ${error}`);
    throw error;
  }
}

/**
 * Connect to the Fabric network
 * @returns {Promise<Object>} The connected network gateway and contract
 */
async function connectToNetwork() {
  try {
    // Initialize the wallet
    const wallet = await initializeWallet();
    
    // Load the connection profile
    const connectionProfileBuffer = fs.readFileSync(CONNECTION_PROFILE_PATH, 'utf8');
    const connectionProfile = JSON.parse(connectionProfileBuffer);

    // Create a new gateway for connecting to the peer node
    const gateway = new Gateway();
    
    const adminUser = process.env.FABRIC_ADMIN_USER || 'admin';
    console.log(`Using identity: ${adminUser} for gateway connection`);
    
    // Connect to the gateway using our identity and connection profile
    await gateway.connect(connectionProfile, {
      wallet,
      identity: adminUser,
      discovery: { enabled: true, asLocalhost: true }
    });
    
    // Get the network channel
    const channelName = process.env.FABRIC_CHANNEL_NAME || 'my-channel1';
    console.log(`Connecting to channel: ${channelName}`);
    const network = await gateway.getNetwork(channelName);
    
    // Get the chaincode contract
    const chaincodeName = process.env.FABRIC_CHAINCODE_NAME || 'chaincode1';
    console.log(`Getting contract: ${chaincodeName}`);
    const contract = network.getContract(chaincodeName);
    
    logger.info(`Successfully connected to the network: ${channelName}`);
    
    return { gateway, contract };
  } catch (error) {
    console.error('Detailed network connection error:', error);
    logger.error(`Failed to connect to the network: ${error}`);
    throw error;
  }
}

/**
 * Disconnect from the Fabric network
 * @param {Object} gateway - The network gateway to disconnect
 */
function disconnectFromNetwork(gateway) {
  if (gateway) {
    gateway.disconnect();
    logger.info('Disconnected from the network');
  }
}

module.exports = {
  connectToNetwork,
  disconnectFromNetwork
};