<template>
  <div :class="{'dark': darkMode}">
    <div class="bg-white dark:bg-dim-900">
      <LoadingPage v-if="isAuthLoading" />

      <div v-else-if="user" class="min-h-full">
        <div class="grid grid-cols-12 mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:gap-5">
        <!-- Left Sidebar-->
          <div class="hidden md:block xs-col-span-1 xl:col-span-2">
            <div class="sticky top-0">
              <SidebarLeft @on-logout="handleUserLoggout" @on-tweet="handelOnTweetModal" :user="user"/>
            </div>
          </div>


        <!-- Main Content -->
          <main class="col-span-12 md:col-span-8 xl:col-span-6">
            <RouterView></RouterView>
          </main>

        <!-- Right Sidebar -->
          <div class="hidden col-span-12 md:block xs-col-span-4 md:col-span-3">
            <div class="sticky top-0">
              <SidebarRight />
            </div>
          </div>

        </div>
      </div>

      <AuthPage v-else />

      <UIModal :isOpen="postTweetModal" @on-close="handleModalClose">
        <TweetForm :replyTo="replyTweet" showReply :user="{...user}" @on-success="handleFormSuccess" />
      </UIModal>
    </div>
  </div>
</template>

<script setup>
import LoadingPage from './components/LoadingPage.vue';
import useEmitter from './composables/useEmitter';

const darkMode = ref(false)

const {useAuthUser, initAuth , useAuthLoading , logout} = useAuth()
const isAuthLoading = useAuthLoading()
const {closePostTweetModal, usePostTweetModal, openPostTweetModal, useReplyTweet}= useTweets()
const user = useAuthUser()

const postTweetModal = usePostTweetModal()

const emiiter = useEmitter()
const replyTweet = useReplyTweet()

emiiter.$on('replyTweet', (tweet) => {
  openPostTweetModal(tweet)
  emiiter.$emit('replyTweet', tweet)
})

emiiter.$on('toggleDarkMode', () => {
  darkMode.value = !darkMode.value
})

onBeforeMount(()=>{
  initAuth()
})

function handleFormSuccess(tweet) {
  closePostTweetModal()
  navigateTo({
    path: "/status/" + tweet.id
  })
}

function handleModalClose() {
  closePostTweetModal()
}

function handelOnTweetModal() {
  openPostTweetModal(null)
}

function handleUserLoggout() {
  logout()
}

</script>