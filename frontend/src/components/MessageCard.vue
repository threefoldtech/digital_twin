<template>
  <div class="card-gutter grid grid-cols-12 my-4">
    <AvatarImg v-if="!hideAvatar" class="mr-8 col-span-2" :id="message.from"/>
    <div class="card bg-white rounded-md relative col-start-3 col-end-13">
      <header class="flex justify-between px-4 pt-2 text-xs">
        <div class="title">
          <div class="name inline-block pr-5 ">
            {{ message.from }}
          </div>
          <div class="date inline-block font-thin">
            {{ moment(message.timestamp).fromNow() }}
          </div>
        </div>
        <div class="header-actions align-end">
          <button>
            <i class="fa fa-ellipsis-v" style="font-size: 0.6em"></i>
          </button>
        </div>
      </header>
      <main class="flex">
        <MessageContent :message="message"></MessageContent>
      </main>
      <footer
          class="actions h-6 bg-gray-200 font-light text-xs flex justify-between px-4 opacity-0 absolute w-full rounded-b-md z-10 -bottom-4">
        <button class="m-0 opacity-0 cursor-default">
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
    hideAvatar: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup(props) {


    return {
      moment
    }
  }
});
</script>

<style lang="css">
.card:hover footer {
  opacity:100;
}
</style>
