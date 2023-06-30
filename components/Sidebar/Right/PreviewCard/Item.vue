<template>
<div class="p-3 hover:bg-gray-100 cursor-pointer dark:hover:bg-dim-300
vorder-b" :class="wrappedClasses">
   <slot></slot>
</div>
</template>

<script setup>
const { defaultTransition, twitterBorderColor } = useTailwindConfig();

const wrappedClasses = computed(() => `${defaultTransition} ${twitterBorderColor}`)
</script>