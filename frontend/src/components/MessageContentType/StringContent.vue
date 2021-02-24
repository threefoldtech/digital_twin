<template>
  <span class="pb-2 px-4">{{ message.body }}</span>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "StringContent",
  props: {
    message: {type: Object, required: true},
  },
  setup(props) {

    return {

    };
  }
});
</script>

