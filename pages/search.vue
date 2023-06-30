<template>
   <div>
      <MainSection title="Search" :loading="loading">
         
         <Head>
            <Title>Search</Title>
         </Head>

         <TweetListFeed :tweets="searchTweets"/>
      </MainSection>
   </div>
</template>

<script setup>
const {getTweets:getTweetsComposable} = useTweets()

const loading = ref(false)
const searchTweets = ref([])

const router = useRouter()
const { currentRoute } = router
const tweetId = ref(currentRoute.value?.query.q)

if(tweetId){
   getTweets()
}

watch(() => useRoute().query.q, async () => {
  await getTweets()
})

console.log(currentRoute.value?.query.q)


onBeforeMount(() => {
   getTweets()
})

async function getTweets() {
   loading.value = true
   try {
      const {tweets} = await getTweetsComposable({
         query: currentRoute.value?.query.q
      })
      searchTweets.value = tweets
   } catch (error) {
      console.log(error)
   } finally {
      loading.value = false
   }
}

</script>