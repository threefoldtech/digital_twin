<template>
  <app-layout @addUser="showAddUserDialog = true">
    <div class="relative h-full w-full grid md:customgrid">
      <chat-list v-model="showAddUserDialog"/>
      <div class="hidden w-full h-full md:grid place-items-center">
        <div class="flex flex-col mb-12 text-center">
          <p>Select a chat</p>
          <button
            @click="showAddUserDialog = true"
            class="mt-2 border rounded-full py-1 px-3"
          >
            Or start a new conversation
          </button>
        </div>
      </div>
    </div>
  </app-layout>
</template>

<script lang="ts">
import appLayout from "../../layout/AppLayout.vue";
import { defineComponent, ref, computed, onBeforeMount } from "vue";
import ChatList from "@/components/ChatList.vue";

export default defineComponent({
  name: "Apps",
  components: {
    appLayout,
    ChatList,
  },
  setup({}, ctx) {
    const showAddUserDialog = ref(false);
    return {
      showAddUserDialog,
    };
  },
});
</script>


<style scoped type="text/css">
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  @variants responsive {
    .customgrid {
      grid-template-columns: 400px 1fr;
    }
  }
}
</style>
