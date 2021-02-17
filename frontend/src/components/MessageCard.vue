<template>
  <div class="card-gutter flex">
    <AvatarImg v-if="true" class="mr-8" :id="message.from"/>
    <div class="card bg-white rounded-md my-4 overflow-hidden">
      <header class="flex justify-between px-4 pt-4 text-xs">
        <div class="title">
          <div class="name inline-block pr-5 ">
            {{message.from}}
          </div>
          <div class="date inline-block font-thin">
            {{moment(message.timestamp).fromNow()}}
          </div>
        </div>
        <div class="header-actions align-end">
          <button>
            <i class="fa fa-ellipsis-v"></i>
          </button>
        </div>
      </header>
      <main class="px-4 pb-4">
        <MessageContent :message="message"></MessageContent>
      </main>
      <footer class="h-16 bg-gray-200 font-light text-xs flex justify-between p-4">
        <button>
          <i class="fa fa-thumbs-up"></i>
          Like
        </button>

        <div class="flex">
          <button>
            <i class="fa fa-share"></i>
            Forward
          </button>

          <button>
            <i class="fa fa-reply"></i>
            Reply
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, nextTick, ref, watch} from "vue";
import AvatarImg from "@/components/AvatarImg.vue";
import MessageContent from "@/components/MessageContent.vue";

import moment from "moment";

export default defineComponent({
  name: "MessageCard",
  components: {MessageContent, AvatarImg},
  props: {
    message: Object,
  },
  setup(props) {


   return {
     moment
   }
  }
});
</script>

