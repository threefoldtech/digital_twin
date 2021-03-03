<template>
    <img
        :src="calcExternalResourceLink(message.body.url)"
        @load="$emit('scroll')"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { calcExternalResourceLink } from '@/services/urlService';

export default defineComponent({
    name: 'ImageContent',
    props: {
        message: { type: Object, required: true },
    },
    setup(props) {
        return { calcExternalResourceLink };
    },
});
</script>
