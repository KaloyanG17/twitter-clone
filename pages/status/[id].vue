<template>
   <div>
      <MainSection title="Tweet" :loading="loading">
         
         <Head>
            <Title></Title>
         </Head>

         <TweetDetails :user="user" :tweet="tweet" />
         
      </MainSection>
   </div>
</template>

<script setup>

const loading = ref(false)
const tweet = ref(null)
const {getTweetById} = useTweets()
const {useAuthUser} = useAuth()
const user = useAuthUser()

const router = useRouter()
const { currentRoute } = router
const tweetId = ref(currentRoute.value?.params.id)

if(tweetId){
   getTweet()
}

watch(() => useRoute().params.id , () => {
  getTweet()
})

function getTweetIdFromRoute() {
   return tweetId.value
}

async function getTweet() {
    loading.value = true
    try {
        const response = await getTweetById(getTweetIdFromRoute())
        if(response.tweet === null) {
            setTimeout(() => {
               getTweet()
            }, 1000)
         }

        tweet.value = response.tweet
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false
    }
}

onBeforeMount(() => {
   getTweet()
})

</script>
