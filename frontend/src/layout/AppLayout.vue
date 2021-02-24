<template>
  <div class="bg-gray-100 h-full overflow-hidden relative">
    <div class="pl-0 relative h-full w-full maingrid">
      <Topbar class="top" />
      <Sidebar class="side hidden bg-icon md:block"></Sidebar>
      <div class="content w-full h-full overflow-y-auto relative flex flex-col">
        <div class="relative w-full h-full overflow-y-auto md:p-4">
          <router-view class="absolute w-full h-full" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Sidebar from "@/components/Sidebar.vue";
import Topbar from "@/components/Topbar.vue";

export default defineComponent({
  name: "AppLayout",
  components: { Sidebar, Topbar },

});
</script>

<style scoped>
.maingrid {
  display: grid;
  grid-template-areas:
    "top top"
    "side content"
    "side content";
  grid-template-columns: auto 1fr;
  grid-template-rows: 50px 1fr;
}
.top {
  grid-area: top;
}
.side {
  grid-area: side;
}
.content{
  grid-area: content;
}
</style>
