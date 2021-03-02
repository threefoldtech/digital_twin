<template>
  {{message.body}}
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "ImageContent",
  props: {
    message: {type: Object, required: true},
  },
  setup(props) {

    return {

    };
  }
});
</script>

