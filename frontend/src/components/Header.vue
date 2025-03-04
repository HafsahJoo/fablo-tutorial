<template>
  <header class="bg-blue-600 text-white shadow-md">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <!-- Logo -->
        <div class="text-2xl font-bold">Fablo KV Demo</div>
      </div>
      
      <!-- Connection Status -->
      <div class="flex items-center space-x-4">
        <div class="flex items-center">
          <span class="mr-2">API Status:</span>
          <span 
            class="w-3 h-3 rounded-full" 
            :class="apiConnected ? 'bg-green-400' : 'bg-red-500'"
          ></span>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, onMounted } from 'vue';
import { healthApi } from '../services/api';

export default {
  name: 'Header',
  
  setup() {
    const apiConnected = ref(false);
    
    // Check the API connection on component mount
    onMounted(async () => {
      try {
        const health = await healthApi.check();
        apiConnected.value = health.status === 'OK';
      } catch (error) {
        console.error('API health check failed:', error);
        apiConnected.value = false;
      }
    });
    
    return {
      apiConnected
    };
  }
};
</script>