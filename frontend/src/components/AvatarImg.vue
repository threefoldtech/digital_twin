<template>
    <div
        class="bg-icon rounded-full"
        :style="`background:url(${src}) no-repeat center/cover`"
        :class="{
            'h-12 w-12': !small && !xsmall,
            'h-8 w-8': small,
            'h-6 w-6': xsmall,
        }"
    ></div>
</template>

<script lang="ts">
import { computed } from 'vue';
import { startFetchStatusLoop, statusList } from '@/store/statusStore';
import { calcExternalResourceLink } from '../services/urlService';

export default {
    name: 'AvatarImg',
    props: {
        id: { required: true },
        small: { required: false, default: false, type: Boolean },
        xsmall: { required: false, default: false, type: Boolean },
    },
    setup(props) {
        // startFetchStatusLoop(props.id)

        const status = computed(() => {
            return statusList[<string>props.id];
        });

        const src = computed(() => {
            if (!status.value || !status.value.avatar) {
                return `https://avatars.dicebear.com/4.5/api/jdenticon/${encodeURI(
                    <string>props.id
                )}.svg?m=14&b=%23ffffff`;
            }
            return calcExternalResourceLink(status.value.avatar);
        });

        return {
            src,
        };
    },
};
</script>
