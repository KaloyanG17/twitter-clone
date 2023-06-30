import { userTrasformer } from "~/server/transformers/user"

export default defineEventHandler(async (event) => {
   return {
      user: userTrasformer(event.context.auth?.user)
   }
})