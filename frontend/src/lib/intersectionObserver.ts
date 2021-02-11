import { onMounted, Ref, ref, onUnmounted } from 'vue';

export const useIntersectionObserver = (
    target: Ref<HTMLElement>,
    options: IntersectionObserverInit = { root: null, rootMargin: '0px' }
) => {
    const intersectionRatio = ref(0);
    const isIntersecting = ref(false);
    const isFullyInView = ref(false);

    const observe = () => {
        if (target.value) {
            observer.observe(target.value);
        }
    };

    let observer: IntersectionObserver;
    onMounted(() => {
        observer = new IntersectionObserver(([entry]) => {
            intersectionRatio.value = entry.intersectionRatio;
            if (entry.intersectionRatio > 0) {
                isIntersecting.value = true;
                isFullyInView.value = entry.intersectionRatio >= 1;
                return;
            }

            isIntersecting.value = false;
        }, options);

        observe();
    });

    const unobserve = () => {
        if (!observer) return;

        if (target.value) {
            observer.unobserve(target.value);
        }
    };

    onUnmounted(unobserve);

    return {
        intersectionRatio,
        isIntersecting,
        isFullyInView,
        observe,
        unobserve
    };
};
