<template>
  <div class="card">
    <h2 class="text-xl font-semibold mb-4">Retrieve Value by Key</h2>
    
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label for="searchKey" class="label">Key</label>
        <input 
          id="searchKey" 
          v-model="searchKey" 
          type="text" 
          class="input" 
          placeholder="Enter key to search"
          required
        />
      </div>
      
      <div class="flex justify-end">
        <button 
          type="submit" 
          class="btn btn-primary"
          :disabled="isLoading"
        >
          <span v-if="isLoading">Searching...</span>
          <span v-else>Search</span>
        </button>
      </div>
    </form>
    
    <!-- Result display -->
    <div v-if="result" class="mt-4 p-4 bg-gray-50 rounded-md">
      <h3 class="font-medium mb-2">Result:</h3>
      <div class="flex">
        <div class="font-semibold mr-2">Key:</div>
        <div>{{ result.key }}</div>
      </div>
      <div class="flex">
        <div class="font-semibold mr-2">Value:</div>
        <div>{{ result.value }}</div>
      </div>
    </div>
    
    <!-- Error message -->
    <div v-if="errorMessage" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { kvApi } from '../services/api';

export default {
  name: 'KVRetrieval',
  
  setup() {
    const searchKey = ref('');
    const result = ref(null);
    const isLoading = ref(false);
    const errorMessage = ref('');
    
    // Handle form submission
    const handleSubmit = async () => {
      // Clear messages and results
      errorMessage.value = '';
      result.value = null;
      
      try {
        isLoading.value = true;
        
        // Call the API to retrieve the value
        const response = await kvApi.getValue(searchKey.value);
        
        if (response.error) {
          errorMessage.value = response.error;
        } else {
          // Store the result
          result.value = {
            key: searchKey.value,
            value: response.value
          };
        }
      } catch (error) {
        console.error('Error retrieving value:', error);
        errorMessage.value = error.response?.data?.error || 'Failed to retrieve value';
      } finally {
        isLoading.value = false;
      }
    };
    
    return {
      searchKey,
      result,
      isLoading,
      errorMessage,
      handleSubmit
    };
  }
};
</script>