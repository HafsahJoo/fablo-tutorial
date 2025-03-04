<template>
  <div class="card">
    <h2 class="text-xl font-semibold mb-4">Store Key-Value Pair</h2>
    
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label for="key" class="label">Key</label>
        <input 
          id="key" 
          v-model="key" 
          type="text" 
          class="input" 
          placeholder="Enter key"
          required
        />
      </div>
      
      <div class="mb-4">
        <label for="value" class="label">Value</label>
        <input 
          id="value" 
          v-model="value" 
          type="text" 
          class="input" 
          placeholder="Enter value"
          required
        />
      </div>
      
      <div class="flex justify-end">
        <button 
          type="submit" 
          class="btn btn-primary"
          :disabled="isLoading"
        >
          <span v-if="isLoading">Storing...</span>
          <span v-else>Store</span>
        </button>
      </div>
    </form>
    
    <!-- Success message -->
    <div v-if="successMessage" class="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
      {{ successMessage }}
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
  name: 'KVForm',
  
  emits: ['value-stored'],
  
  setup(props, { emit }) {
    const key = ref('');
    const value = ref('');
    const isLoading = ref(false);
    const successMessage = ref('');
    const errorMessage = ref('');
    
    // Handle form submission
    const handleSubmit = async () => {
      // Clear messages
      successMessage.value = '';
      errorMessage.value = '';
      
      try {
        isLoading.value = true;
        
        // Call the API to store the key-value pair
        const result = await kvApi.putValue(key.value, value.value);
        
        // Display success message
        successMessage.value = `Successfully stored: ${key.value} = ${value.value}`;
        
        // Clear form fields
        key.value = '';
        value.value = '';
        
        // Emit event to parent component
        emit('value-stored');
      } catch (error) {
        console.error('Error storing key-value pair:', error);
        errorMessage.value = error.response?.data?.error || 'Failed to store key-value pair';
      } finally {
        isLoading.value = false;
      }
    };
    
    return {
      key,
      value,
      isLoading,
      successMessage,
      errorMessage,
      handleSubmit
    };
  }
};
</script>