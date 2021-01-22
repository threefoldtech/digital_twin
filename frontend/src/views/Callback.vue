<template>
  <div>
    <h2>callback</h2>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "Home",
  setup() {
    window.opener.postMessage({
      message: "LoginRedirectSuccess"
    });
  }
});
</script>
