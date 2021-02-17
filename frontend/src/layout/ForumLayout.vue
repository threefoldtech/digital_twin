<template>
  <div class="bg-gray-100 h-full overflow-hidden relative">
    <div class="pl-0 relative h-full w-full flex">
      <Sidebar class="hidden md:block bg-icon"></Sidebar>
      <div class="w-full h-full overflow-y-auto relative flex flex-col md:p-4">
        <ForumTopbar class="mb-5" />
        <div class="relative w-full h-full overflow-y-auto">
          <router-view class="absolute w-full" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Sidebar from "@/components/Sidebar.vue";
import ForumTopbar from "@/components/ForumTopbar.vue";

export default defineComponent({
  name: "AppLayout",
  components: { Sidebar, ForumTopbar },

});
</script>

<style scoped>
</style>
