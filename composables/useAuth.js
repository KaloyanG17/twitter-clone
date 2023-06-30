import jwt_decode from 'jwt-decode'

export default () => {
   const useAuthToken = () => useState('auth_Token') 
   const useAuthUser = () => useState('auth_User')
   const useAuthLoading = () => useState('auth_Loading', () => true)

   const setToken = (newToken) => {
      const authToken = useAuthToken()
      authToken.value = newToken
   }

   const setUser = (newUser) => {
      const authUser = useAuthUser()
      authUser.value = newUser
   }

   const login = ({ username, password }) => {
      return new Promise(async (resolve, reject) => {
          try {
              const data = await $fetch('/api/auth/login', {
                  method: 'POST',
                  body: {
                      username,
                      password
                  }
              })
              setToken(data.access_Token)
              setUser(data.user)

              resolve(true)
          } catch (error) {
              reject(error)
          }
      })
   }

   const refreshToken = () => {
      return new Promise(async (resolve, reject) => {
         try {
           const data = await $fetch('/api/auth/refresh')
           setToken(data.access_Token)
           resolve(true)

         } catch (error) {
            reject(error)
         }
      })
   }

   const getUser = () => {
      return new Promise(async (resolve, reject) => {
         try {
             const data = await useFetchApi('/api/auth/user')
             setUser(data.user)
             resolve(true)
         } catch (error) {
             reject(error)
         }
     })
   }

   const reRefreshAccessToken = () => {
      const authToken = useAuthToken()

      if(!authToken.value) return

      const jwt = jwt_decode(authToken.value)

      const newRefreshTime = jwt.exp - 60000
      
      setTimeout(async () => {
         await refreshToken()
         reRefreshAccessToken()
      }, newRefreshTime)
   }

   const initAuth = () => {
      return new Promise(async (resolve, reject) => {
         useAuthLoading().value = true
         try {
            await refreshToken()
            await getUser()

            reRefreshAccessToken()

            resolve(true)
         } catch (error) {
            reject(error)
         } finally {
            useAuthLoading().value = false
         }
      })
   }

   const logout = () => {
      return new Promise(async (resolve, reject) => {
          try {
              await useFetchApi('/api/auth/logout', {
                  method: 'POST'
              })

              setToken(null)
              setUser(null)
              resolve()
          } catch (error) {
              reject(error)
          }
      })
  }

  const registerUser = ({ username, password, repeatPassword, email, name }) => {
      return new Promise(async (resolve, reject) => {
         try {
            const data = await $fetch('/api/auth/register', {
               method: 'POST',
               body: {
                  username,
                  password,
                  repeatPassword,
                  email,
                  name,
               }
            })
            resolve()
         } catch(error) {
            reject(error)
         }
      }
  )}

   return {
      login,
      useAuthUser,
      initAuth,
      useAuthToken,
      useAuthLoading,
      logout,
      registerUser,
   }
}