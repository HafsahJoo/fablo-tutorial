/**
 * Controller for Key-Value operations using the chaincode
 */
const { connectToNetwork, disconnectFromNetwork } = require('../fabric/connection');
const logger = require('../config/logger');

/**
 * Get a value from the ledger by key
 */
exports.getValue = async (req, res) => {
  let gateway;
  
  try {
    const { key } = req.params;
    
    if (!key) {
      return res.status(400).json({ error: 'Key parameter is required' });
    }
    
    // Connect to the network
    const connection = await connectToNetwork();
    gateway = connection.gateway;
    const contract = connection.contract;
    
    // Invoke the chaincode to get the value
    logger.info(`Fetching value for key: ${key}`);
    const result = await contract.evaluateTransaction('KVContract:get', key);
    const response = JSON.parse(result.toString());
    
    // Check if the key was found
    if (response.error === 'NOT_FOUND') {
      return res.status(404).json({ error: 'Key not found' });
    }
    
    // Return the value
    return res.status(200).json({ key, value: response.success });
    
  } catch (error) {
    logger.error(`Error getting value: ${error}`);
    return res.status(500).json({ error: `Failed to get value: ${error.message}` });
  } finally {
    // Disconnect from the network
    disconnectFromNetwork(gateway);
  }
};

/**
 * Put a key-value pair into the ledger
 */
exports.putValue = async (req, res) => {
  let gateway;
  
  try {
    const { key, value } = req.body;
    
    if (!key || !value) {
      return res.status(400).json({ error: 'Both key and value are required' });
    }
    
    // Connect to the network
    const connection = await connectToNetwork();
    gateway = connection.gateway;
    const contract = connection.contract;
    
    // Submit the transaction to store the key-value pair
    logger.info(`Storing key-value pair: ${key}=${value}`);
    const result = await contract.submitTransaction('KVContract:put', key, value);
    const response = JSON.parse(result.toString());
    
    // Return success
    return res.status(201).json({ 
      key, 
      value, 
      response: response.success 
    });
    
  } catch (error) {
    logger.error(`Error putting value: ${error}`);
    return res.status(500).json({ error: `Failed to store key-value pair: ${error.message}` });
  } finally {
    // Disconnect from the network
    disconnectFromNetwork(gateway);
  }
};

/**
 * Put a private message into the ledger
 */
exports.putPrivateMessage = async (req, res) => {
  let gateway;
  
  try {
    const { collection, message } = req.body;
    
    if (!collection || !message) {
      return res.status(400).json({ error: 'Both collection and message are required' });
    }
    
    // Connect to the network
    const connection = await connectToNetwork();
    gateway = connection.gateway;
    const contract = connection.contract;
    
    // Create the transient data map
    const transientData = {
      message: Buffer.from(message)
    };
    
    // Submit the transaction to store the private data
    logger.info(`Storing private message in collection: ${collection}`);
    const result = await contract.createTransaction('KVContract:putPrivateMessage')
      .setTransient(transientData)
      .submit(collection);
    
    const response = JSON.parse(result.toString());
    
    // Return success
    return res.status(201).json({ 
      collection, 
      response: response.success 
    });
    
  } catch (error) {
    logger.error(`Error putting private message: ${error}`);
    return res.status(500).json({ error: `Failed to store private message: ${error.message}` });
  } finally {
    // Disconnect from the network
    disconnectFromNetwork(gateway);
  }
};

/**
 * Get a private message from the ledger
 */
exports.getPrivateMessage = async (req, res) => {
  let gateway;
  
  try {
    const { collection } = req.params;
    
    if (!collection) {
      return res.status(400).json({ error: 'Collection parameter is required' });
    }
    
    // Connect to the network
    const connection = await connectToNetwork();
    gateway = connection.gateway;
    const contract = connection.contract;
    
    // Invoke the chaincode to get the private message
    logger.info(`Fetching private message from collection: ${collection}`);
    const result = await contract.evaluateTransaction('KVContract:getPrivateMessage', collection);
    const response = JSON.parse(result.toString());
    
    // Return the message
    return res.status(200).json({ 
      collection, 
      message: response.success 
    });
    
  } catch (error) {
    logger.error(`Error getting private message: ${error}`);
    return res.status(500).json({ error: `Failed to get private message: ${error.message}` });
  } finally {
    // Disconnect from the network
    disconnectFromNetwork(gateway);
  }
};

/**
 * Verify a private message on the ledger
 */
exports.verifyPrivateMessage = async (req, res) => {
  let gateway;
  
  try {
    const { collection, message } = req.body;
    
    if (!collection || !message) {
      return res.status(400).json({ error: 'Both collection and message are required' });
    }
    
    // Connect to the network
    const connection = await connectToNetwork();
    gateway = connection.gateway;
    const contract = connection.contract;
    
    // Create the transient data map
    const transientData = {
      message: Buffer.from(message)
    };
    
    // Submit the transaction to verify the private data
    logger.info(`Verifying private message in collection: ${collection}`);
    const result = await contract.createTransaction('KVContract:verifyPrivateMessage')
      .setTransient(transientData)
      .evaluate(collection);
    
    const response = JSON.parse(result.toString());
    
    // Check verification result
    if (response.error === 'VERIFICATION_FAILED') {
      return res.status(400).json({ verified: false, message: 'Message verification failed' });
    }
    
    // Return verification success
    return res.status(200).json({ 
      verified: true, 
      collection
    });
    
  } catch (error) {
    logger.error(`Error verifying private message: ${error}`);
    return res.status(500).json({ error: `Failed to verify private message: ${error.message}` });
  } finally {
    // Disconnect from the network
    disconnectFromNetwork(gateway);
  }
};