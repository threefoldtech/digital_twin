<template>
  <router-view/>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: 'App'
})
</script>

<style>
a {
  text-decoration: none!important;
}
#app .prose h1,
#app .prose h2,
#app .prose h3 {
  margin-top: 0;
  margin-bottom: 0;
}
/* #app h1 {
  font-size: 32px;
}
#app h2 {
  font-size: 24px;
} */
</style>
