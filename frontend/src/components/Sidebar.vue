<template>
  <nav>
    <div class="flex flex-col h-full items-center justify-center mx-2">
      <div
          v-for="app in apps"
          :key="app.name"
          class="mb-4 grid text-center text-white"
          :class="{
            'text-gray-400': !app?.enabled,
          'cursor-pointer': app.enabled}
"
      >
        <div class="h-20 w-20 rounded-full grid place-items-center mb-1" style="position: relative">
          <button @click="changePage(app.name)">
          <i :class="`fas ${app.icon} text-2xl`"></i>
            <h3>
              {{ app.name }}
            </h3>
          <!--          <div class="bar" v-if="!app.enabled" style="width: 100%;height: 4px; background-color:#888; position:absolute; left:0;transform: rotate(-45deg)"></div>-->

          </button>
        </div>

      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import {defineComponent, computed} from "vue";
import {useRouter} from "vue-router";

export default defineComponent({
  name: "Sidebar",
  setup() {
    const apps = [
      {
        name: "chat",
        icon: "fas fa-comments",
        enabled: true
      },
      {
        name: "forum",
        icon: "fas fa-stream",
        enabled: true
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

    const changePage = (page) => {
      router.push(page)
    }

    return {
      currentRoute,
      apps,
      changePage
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
