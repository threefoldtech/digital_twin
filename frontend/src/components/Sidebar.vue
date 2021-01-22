<template>
  <nav>
    <div class="flex flex-col h-full items-center justify-center mx-2">
      <div v-for="app in apps" :key="app.name" class="bg-icon h-24 w-24 mb-2 py-3 rounded-full grid justify-center items-center text-center">
        <i :class="app.icon" ></i>
        {{app.name}}
        </div>
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
    const apps = [
      {
        name: "chat",
        icon: "fas fa-comments"
      },
      {
        name: "meetings",
        icon: "fas fa-video"
      },
      {
        name: "filebrowser",
        icon: "fas fa-file-alt"
      },
    ];
    const router = useRouter();
    
    const currentRoute = computed(() => router.currentRoute.value);
		
    return {
      currentRoute,
      apps
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