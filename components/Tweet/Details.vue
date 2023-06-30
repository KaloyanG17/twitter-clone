<template>
   <div>
      <TweetItem :tweet="props.tweet" />

      <TweetForm placeholder="Tweet Your Reply" :reply-to="props.tweet" 
      :user="props.user" @on-success="handleFormSuccess"/>

      <TweetListFeed :tweets="replies" />
   </div>
</template>

<script setup>
const props = defineProps({
   tweet: {
      type: Object,
      required: true
   },
   user: {
      type: Object,
      required: true
   }
})

const replies = computed(() => props.tweet?.replies || [])

function handleFormSuccess(tweet) {
   navigateTo({
      path: "/status/" + tweet.id
   })
}

</script>