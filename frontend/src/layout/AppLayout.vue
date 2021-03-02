<template>
    <div class="bg-gray-100 h-full overflow-hidden relative">
        <div class="pl-0 relative h-full w-full maingrid md:bigmaingrid">
            <div class="top h-20">
                <Topbar @addUser="addUser">
                    <template v-slot:default>
                        <slot name="top"> </slot>
                    </template>
                    <template v-slot:actions>
                        <slot name="actions"> </slot>
                    </template>
                </Topbar>
            </div>
            <div class="side hidden md:block">
                <slot name="side">
                    <Sidebar class="bg-icon md:block h-full"></Sidebar>
                </slot>
            </div>
            <div
                class="content w-full h-full overflow-y-auto relative flex flex-col"
            >
                <div class="relative w-full h-full overflow-y-auto">
                    <div class="absolute w-full h-full">
                        <slot></slot>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import Sidebar from '@/components/Sidebar.vue';
    import Topbar from '@/components/Topbar.vue';

    export default defineComponent({
        name: 'AppLayout',
        components: { Sidebar, Topbar },
        setup({}, ctx) {
            const addUser = () => {
                ctx.emit('addUser');
            };

            return {
                addUser,
            };
        },
    });
</script>

<style scoped>
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    @layer utilities {
        @variants responsive {
            .bigmaingrid {
                display: grid;
                grid-template-areas:
                    'top top'
                    'side content'
                    'side content';
                grid-template-columns: 100px 1fr;
                grid-template-rows: auto 1fr;
            }
        }
    }

    .maingrid {
        display: grid;
        grid-template-areas:
            'top'
            'content'
            'content';
        grid-template-rows: auto 1fr;
    }
    .top {
        grid-area: top;
    }
    .side {
        grid-area: side;
    }
    .content {
        grid-area: content;
    }
</style>
