<template>
   <div class="w-full">
      <div class="flex justify-center">
         <div class="w-10 h-10">
            <LogoTwitter />
         </div>
      </div>
      <div>
         <div v-if="toggleAcc" class="pt-5 space-y-6">
            <UIInput value="" label="Username" placeholder="@username - Must be between 3 and 26 chars" v-model="data.username"/> 
            <UIInput value="" label="Password" placeholder="******** - Must be between 3 and 26 chars" type="password" v-model="data.password"/> 
            <p class="ml-2 text-xs opacity-50 dark:text-gray-500"><i>Username: demo Password: password</i></p>
            <UIButton @click="handleLogin" liquid :disabled="isButtonDisabled">
               Login
            </UIButton>
            <UIButton @click="toggleAcc = !toggleAcc" liquid>
               Dont have an account?
            </UIButton>
            <div>
               <p class="flex justify-center text-xs text-red-600" v-if="data.loginFail"><i>Wrong username or password</i></p>
            </div>
         </div>

         <!-- REGISTER -->
         <div v-else class="pt-5 space-y-6">
            <UIInput value="" label="Username" placeholder="@username - Must be between 3 and 26 chars" v-model="data.username"/> 
            <UIInput value="" label="Password" placeholder="******** - Must be between 3 and 26 chars" v-model="data.password"/> 
            <UIInput value="" label="Repeat Password" placeholder="******** - Repeat Password" v-model="data.repeatPassword"/> 
            <UIInput value="" label="Email" placeholder="email@email.com - Enter your email address" v-model="data.email"/> 
            <UIInput value="" label="Name" placeholder="Name - Enter your name" v-model="data.name"/> 

            <UIButton @click="handleRegister" liquid :disabled="isButtonDisabled">
               Register
            </UIButton>
            <UIButton @click="toggleAcc = !toggleAcc" liquid >
               Already Registered?
            </UIButton>
            <div>
               <p class="flex justify-center text-xs text-red-600" v-if="data.registerFail"><i>Invalid register</i></p>
            </div>
            <div>
               <p class="flex justify-center text-xs text-green-500" v-if="data.registerSuccess"><i>You are Registered!</i></p>
            </div>
         </div>
         
      </div>
   </div>
</template>

<script setup>
const data = reactive({
   password: '',
   username: '',
   repeatPassword: '',
   email: '',
   name: '',
   loading: false,
   loginFail: false,
   registerFail: false,
   registerSuccess: false,
})

const toggleAcc = ref(true)

async function handleLogin(){
   data.loading = true
   const { login } = useAuth()
   try {
      await login({
         username: data.username,
         password: data.password
      })
   } catch (error) {
      data.loginFail = true
      console.log(error)
   } finally {
      data.loading = false
   }
}

async function handleRegister() {
   data.loading = true
   const { registerUser } = useAuth()
   try {
      await registerUser({
         username: data.username,
         password: data.password,
         repeatPassword: data.repeatPassword,
         email: data.email,
         name: data.name
      })
   } catch (error) {
      data.registerFail = true
      console.log(error)
   } finally {
      data.loading = false
   }
}

const isButtonDisabled = computed(() => {
   return (!data.username || !data.password) || (data.loading) 
})



</script>
