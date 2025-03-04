<template>
  <div class="card">
    <h2 class="text-xl font-semibold mb-4">Private Data Collections</h2>
    
    <div class="mb-6">
      <h3 class="text-lg font-medium mb-3">Store Private Message</h3>
      <form @submit.prevent="handleStoreSubmit">
        <div class="mb-4">
          <label for="collection" class="label">Collection</label>
          <input 
            id="collection" 
            v-model="storeCollection" 
            type="text" 
            class="input" 
            placeholder="Enter collection name"
            required
          />
        </div>
        
        <div class="mb-4">
          <label for="message" class="label">Message</label>
          <textarea 
            id="message" 
            v-model="message" 
            class="input h-24" 
            placeholder="Enter private message"
            required
          ></textarea>
        </div>
        
        <div class="flex justify-end">
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="isStoreLoading"
          >
            <span v-if="isStoreLoading">Storing...</span>
            <span v-else>Store Private Data</span>
          </button>
        </div>
      </form>
      
      <!-- Store success message -->
      <div v-if="storeSuccessMessage" class="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
        {{ storeSuccessMessage }}
      </div>
      
      <!-- Store error message -->
      <div v-if="storeErrorMessage" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
        {{ storeErrorMessage }}
      </div>
    </div>
    
    <div class="border-t pt-6">
      <h3 class="text-lg font-medium mb-3">Retrieve Private Message</h3>
      <form @submit.prevent="handleRetrieveSubmit">
        <div class="mb-4">
          <label for="retrieveCollection" class="label">Collection</label>
          <input 
            id="retrieveCollection" 
            v-model="retrieveCollection" 
            type="text" 
            class="input" 
            placeholder="Enter collection name"
            required
          />
        </div>
        
        <div class="flex justify-end">
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="isRetrieveLoading"
          >
            <span v-if="isRetrieveLoading">Retrieving...</span>
            <span v-else>Retrieve Private Data</span>
          </button>
        </div>
      </form>
      
      <!-- Retrieve result display -->
      <div v-if="retrieveResult" class="mt-4 p-4 bg-gray-50 rounded-md">
        <h3 class="font-medium mb-2">Result:</h3>
        <div class="flex">
          <div class="font-semibold mr-2">Collection:</div>
          <div>{{ retrieveResult.collection }}</div>
        </div>
        <div class="flex">
          <div class="font-semibold mr-2 whitespace-nowrap">Message:</div>
          <div>{{ retrieveResult.message }}</div>
        </div>
      </div>
      
      <!-- Retrieve error message -->
      <div v-if="retrieveErrorMessage" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
        {{ retrieveErrorMessage }}
      </div>
    </div>
    
    <div class="border-t pt-6 mt-6">
      <h3 class="text-lg font-medium mb-3">Verify Private Message</h3>
      <form @submit.prevent="handleVerifySubmit">
        <div class="mb-4">
          <label for="verifyCollection" class="label">Collection</label>
          <input 
            id="verifyCollection" 
            v-model="verifyCollection" 
            type="text" 
            class="input" 
            placeholder="Enter collection name"
            required
          />
        </div>
        
        <div class="mb-4">
          <label for="verifyMessage" class="label">Message to Verify</label>
          <textarea 
            id="verifyMessage" 
            v-model="verifyMessage" 
            class="input h-24" 
            placeholder="Enter message to verify"
            required
          ></textarea>
        </div>
        
        <div class="flex justify-end">
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="isVerifyLoading"
          >
            <span v-if="isVerifyLoading">Verifying...</span>
            <span v-else>Verify Private Data</span>
          </button>
        </div>
      </form>
      
      <!-- Verify result display -->
      <div v-if="verifyResult" class="mt-4 p-3 rounded-md" 
           :class="verifyResult.verified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
        <div v-if="verifyResult.verified">
          ✓ Message verified successfully for collection: {{ verifyResult.collection }}
        </div>
        <div v-else>
          ✗ {{ verifyResult.message }}
        </div>
      </div>
      
      <!-- Verify error message -->
      <div v-if="verifyErrorMessage" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
        {{ verifyErrorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { kvApi } from '../services/api';

export default {
  name: 'PrivateDataPanel',
  
  setup() {
    // Store private data
    const storeCollection = ref('');
    const message = ref('');
    const isStoreLoading = ref(false);
    const storeSuccessMessage = ref('');
    const storeErrorMessage = ref('');
    
    // Retrieve private data
    const retrieveCollection = ref('');
    const retrieveResult = ref(null);
    const isRetrieveLoading = ref(false);
    const retrieveErrorMessage = ref('');
    
    // Verify private data
    const verifyCollection = ref('');
    const verifyMessage = ref('');
    const verifyResult = ref(null);
    const isVerifyLoading = ref(false);
    const verifyErrorMessage = ref('');
    
    // Handle store form submission
    const handleStoreSubmit = async () => {
      // Clear messages
      storeSuccessMessage.value = '';
      storeErrorMessage.value = '';
      
      try {
        isStoreLoading.value = true;
        
        // Call the API to store the private message
        await kvApi.putPrivateMessage(storeCollection.value, message.value);
        
        // Display success message
        storeSuccessMessage.value = `Successfully stored private message in collection: ${storeCollection.value}`;
        
        // Clear form fields but keep the collection name for convenience
        message.value = '';
      } catch (error) {
        console.error('Error storing private message:', error);
        storeErrorMessage.value = error.response?.data?.error || 'Failed to store private message';
      } finally {
        isStoreLoading.value = false;
      }
    };
    
    // Handle retrieve form submission
    const handleRetrieveSubmit = async () => {
      // Clear messages and results
      retrieveResult.value = null;
      retrieveErrorMessage.value = '';
      
      try {
        isRetrieveLoading.value = true;
        
        // Call the API to retrieve the private message
        const response = await kvApi.getPrivateMessage(retrieveCollection.value);
        
        // Store the result
        retrieveResult.value = {
          collection: retrieveCollection.value,
          message: response.message
        };
      } catch (error) {
        console.error('Error retrieving private message:', error);
        retrieveErrorMessage.value = error.response?.data?.error || 'Failed to retrieve private message';
      } finally {
        isRetrieveLoading.value = false;
      }
    };
    
    // Handle verify form submission
    const handleVerifySubmit = async () => {
      // Clear messages and results
      verifyResult.value = null;
      verifyErrorMessage.value = '';
      
      try {
        isVerifyLoading.value = true;
        
        // Call the API to verify the private message
        const response = await kvApi.verifyPrivateMessage(verifyCollection.value, verifyMessage.value);
        
        // Store the result
        verifyResult.value = {
          verified: response.verified,
          collection: verifyCollection.value,
          message: response.message
        };
      } catch (error) {
        console.error('Error verifying private message:', error);
        verifyErrorMessage.value = error.response?.data?.error || 'Failed to verify private message';
      } finally {
        isVerifyLoading.value = false;
      }
    };
    
    return {
      // Store private data
      storeCollection,
      message,
      isStoreLoading,
      storeSuccessMessage,
      storeErrorMessage,
      handleStoreSubmit,
      
      // Retrieve private data
      retrieveCollection,
      retrieveResult,
      isRetrieveLoading,
      retrieveErrorMessage,
      handleRetrieveSubmit,
      
      // Verify private data
      verifyCollection,
      verifyMessage,
      verifyResult,
      isVerifyLoading,
      verifyErrorMessage,
      handleVerifySubmit
    };
  }
};
</script>