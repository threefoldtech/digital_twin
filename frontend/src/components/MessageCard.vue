<template>
    <div class="flex">
        <div class="flex justify-center w-18 mr-4">
            <AvatarImg :id="message.from" />
        </div>
        <div class="card w-full bg-white rounded-md mb-4 overflow-hidden">
            <header class="flex justify-between pl-2 pt-2 text-xs items-center">
                <div class="title">
                    <div class="name inline-block pr-5">
                        {{ message.from }}
                    </div>
                    <div class="date inline-block font-thin">
                        {{ moment(message.timestamp).fromNow() }}
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
            <footer
                class="hidden h-16 bg-gray-200 font-light text-xs justify-between p-4"
            >
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
    import { computed, defineComponent, ref, watch } from 'vue';
    import moment from 'moment';
    import AvatarImg from '@/components/AvatarImg.vue';
    import MessageContent from '@/components/MessageContent.vue';

    export default defineComponent({
        name: 'MessageCard',
        components: { MessageContent, AvatarImg },
        props: {
            message: Object,
        },
        setup(props) {
            return {
                moment,
            };
        },
    });
</script>
<style lang="css">
    .text-message * {
        word-wrap: break-word;
        max-width: 100%;
        white-space: pre-wrap;
    }
</style>
