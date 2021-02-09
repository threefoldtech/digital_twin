<template>
  <nav>
    <div class="flex flex-col h-full items-center justify-center mx-2">
      <div
        v-for="app in apps"
        :key="app.name"
        class="mb-4 grid text-center text-white cursor-pointer"
      >
        <div class="h-20 w-20 rounded-full grid place-items-center mb-1">
          <i :class="`fas ${app.icon} text-2xl`"></i>
        </div>
        <h3>
          {{ app.name }}
        </h3>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Sidebar",
  setup() {
    const apps = [
      {
        name: "chat",
        icon: "fas fa-comments",
      },
      {
        name: "meetings",
        icon: "fas fa-video",
      },
      {
        name: "filebrowser",
        icon: "fas fa-file-alt",
      },
    ];
    const router = useRouter();

    const currentRoute = computed(() => router.currentRoute.value);

    return {
      currentRoute,
      apps,
    };
  },
});
</script>

<style scoped>
.active {
  position: relative;
}
.active::after {
  position: absolute;
  content: "";
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #e69b5950;
  border-left: 8px solid #e69b59;
}
</style>