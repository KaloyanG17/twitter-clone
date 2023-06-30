import {getUserByUsername} from '../../db/users.js'
import bcrypt from 'bcrypt'
import {generateTokens , sendRefreshToken} from '../../utils/jwt.js'
import { createRefreshToken } from '~/server/db/refreshTokens.js'
import { userTrasformer } from '~/server/transformers/user.js'
import { sendError } from 'h3'

export default defineEventHandler(async (event) => {

   const body = await readBody(event)

   const {username, password} = body

   if(!username || !password){
      return sendError(event, createError({
         statusCode: 400,
         statusMessage: 'Invalid params'
      }))
   }

   const user = await getUserByUsername(username)

   if(!user) {
      return sendError(event, createError({
         statusCode: 400,
         statusMessage: 'Username or password is incorrect'
      }))
   }

   const doesThePasswordMatch = await bcrypt.compare(password, user.password)

   if(!doesThePasswordMatch){
      return sendError(event, createError({
         statusCode: 400,
         statusMessage: 'Username or password is incorrect'
      }))
   }

   const {accessToken, refreshToken} = generateTokens(user)

   await createRefreshToken({
      token: refreshToken,
      userId: user.id
   })

   sendRefreshToken(event, refreshToken)

   return {
      access_Token: accessToken,
      user: userTrasformer(user),
   }
})