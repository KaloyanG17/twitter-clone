import {sendError, parseCookies} from "h3";
import { getRefreshTokenByToken } from "../../db/refreshTokens.js";
import { decodeRefreshToken, generateTokens} from "../../utils/jwt.js";
import { getUserById } from "../../db/users.js";

export default defineEventHandler(async (event) => {
   const cookies = parseCookies(event)

   const refreshToken = cookies.refresh_token

   if(!refreshToken){
      return sendError(event, createError({
         statusCode: 401,
         statusMessage: 'Unauthorized'
      }))
   }

   const rToken = await getRefreshTokenByToken(refreshToken)

   if(!rToken){
      return sendError(event, createError({
         statusCode: 401,
         statusMessage: 'Unauthorized'
      }))
   }

   const token = decodeRefreshToken(refreshToken)

   try{
      const user = await getUserById(rToken.userId)

      const {accessToken} = generateTokens(user)

      return {
         access_Token: accessToken,
      }
   } catch (error) {
      return sendError(event, createError({
         statusCode: 500,
         statusMessage: 'Unauthorized'
      }))
   }
});