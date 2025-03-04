<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header Component -->
    <Header />
    
    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8 text-center">Hyperledger Fabric KV Store</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Left Column for basic key-value operations -->
        <div class="space-y-8">
          <KVForm @value-stored="refreshData" />
          <KVRetrieval />
        </div>
        
        <!-- Right Column for private data operations -->
        <div>
          <PrivateDataPanel />
        </div>
      </div>
    </main>
    
    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-6 mt-12">
      <div class="container mx-auto px-4 text-center">
        <p>Fablo Tutorial - Hyperledger Fabric Blockchain Demo</p>
        <p class="text-gray-400 text-sm mt-2">Powered by Fablo and Vue.js</p>
      </div>
    </footer>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import KVForm from './components/KVForm.vue';
import KVRetrieval from './components/KVRetrieval.vue';
import PrivateDataPanel from './components/PrivateDataPanel.vue';

export default {
  name: 'App',
  components: {
    Header,
    KVForm,
    KVRetrieval,
    PrivateDataPanel
  },
  
  setup() {
    const refreshData = () => {
      // This function can be used to refresh data if needed
      console.log('Data refreshed');
    };
    
    return {
      refreshData
    };
  }
};
</script>