<template>
  <div class="bg-gray-300">
    <MessageContent :message="message.body.quotedMessage"></MessageContent>
  </div>
  {{ message.body.quotedMessage.body }}
  hier
  <br>
  <span>{{ message.body.message }}</span>
  <pre class="bg-red-300 p-4 break-words">{{ message.body }}</pre>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import MessageCard from "@/components/MessageCard.vue";
import MessageContent from "@/components/MessageContent.vue";

export default defineComponent({
  name: "QuoteContent",
  components: {MessageContent, MessageCard},
  props: {
    message: {type: Object, required: true},
  },
  setup(props) {

    return {};
  }
});
</script>

