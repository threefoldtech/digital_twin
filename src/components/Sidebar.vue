<template>
  <nav>
    <div class="flex flex-col h-full items-center justify-center">
      <div v-for="i in 10" :key="i" class="bg-red-500 h-20 w-20 mb-2 rounded-full"></div>
      <!-- <router-link v-for="index of 10" :key="index" class="w-full h-20 flex justify-center items-center" :class="[currentRoute.params.tab === tab.name ? 'active' : 'opacity-50']" :to="`/vault/files/${tab.name.toLowerCase()}`">
        <i class="text-2xl text-primary" :class="tab.icon"></i>
      </router-link> -->
    </div>
  </nav>
</template>

<script lang="ts">
import {defineComponent, computed} from "vue";
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Sidebar',
  setup() {
    const router = useRouter();
    
    const currentRoute = computed(() => router.currentRoute.value);
		
    return {
      currentRoute
    }
  }
})
</script>

<style scoped>
.active  {
  position:relative
}
.active::after {
  position: absolute;
  content: '';
  left: 0;
  top: 0;
  width:100%;
  height:100%;
  background: #E69B5950;
  border-left: 8px solid #E69B59;
}
</style>