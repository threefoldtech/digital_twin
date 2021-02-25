<template>
  <div class="bg-gray-100 h-full overflow-hidden relative">
    <div class="pl-0 relative h-full w-full maingrid">
      <slot name="top">
        <div class="top">
          <Topbar />
        </div>
      </slot>
      <slot name="side">
        <div class="side">
          <Sidebar class="bg-icon md:block"></Sidebar>
        </div>
      </slot>
      <div class="content w-full h-full overflow-y-auto relative flex flex-col">
        <div class="relative w-full h-full overflow-y-auto md:p-4">
          <div class="absolute w-full h-full">
            <slot></slot>
          </div>
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
  grid-template-areas:
    "top"
    "content"
    "content";
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
}
.top {
  grid-area: top;
}
.side {
  display: none;
  grid-area: side;
}
.content{
  grid-area: content;
}
</style>
