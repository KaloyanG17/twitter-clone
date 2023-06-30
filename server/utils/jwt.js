import jwt from 'jsonwebtoken';

const genereateAccessToken = (user) => {
   const config = useRuntimeConfig();

   return jwt.sign({userId: user.id}, config.jwtAcessSecret, {
      expiresIn: '10m'
   })
}

const genereateRefreshToken = (user) => {
   const config = useRuntimeConfig();

   return jwt.sign({userId: user.id}, config.jwtRefreshSecret, {
      expiresIn: '4h'
   })
}

export const decodeRefreshToken = (token) => {
   const config = useRuntimeConfig()
   try {
       return jwt.verify(token, config.jwtRefreshSecret)
   } catch (error) {
       return null
   }
}

export const decodeAccessToken = (token) => {
   const config = useRuntimeConfig()
   try {
       return jwt.verify(token, config.jwtAcessSecret)
   } catch (error) {
       return null
   }
}

export const generateTokens = (user) => {
   const accessToken = genereateAccessToken(user);
   const refreshToken = genereateRefreshToken(user);

   return {
      accessToken: accessToken,
      refreshToken: refreshToken
   }
}

export const sendRefreshToken = (event, token) => {
   setCookie(event, "refresh_token", token, {
       httpOnly: true,
       sameSite: true
   })
}