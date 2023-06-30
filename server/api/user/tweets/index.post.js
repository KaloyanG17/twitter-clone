import formidable from 'formidable'
import { createTweet } from '../../../db/tweets.js'
import {tweetTransformer} from '../../../transformers/tweet.js'
import { createMediaFile } from '../../../db/mediaFiles.js'
import { uploadToCloudinary } from '../../../utils/cloudinary.js'

export default defineEventHandler(async (event) => {

   const form = formidable({})

   const response = await new Promise((resolve, reject) => {
      form.parse(event.req, (err, fields, files) => {
         if(err) return reject(err)
         resolve({fields, files})
      })
   })

   const {fields, files} = response

   const userId = event.context?.auth?.user?.id

   const tweetData = {
      text: fields.text.toString(),
      authorId: userId,
   }

   const replyTo = fields.replyTo

   if(replyTo && replyTo !== 'null' && replyTo !== 'undefined') {
      tweetData.replyToId = replyTo.toString()
   }

   const tweet = await createTweet(tweetData)

   const filePromises = Object.keys(files).map(async key => {
      const file = files[key]

      const cloudinaryResource = await uploadToCloudinary(file[0].filepath)

      return createMediaFile({
         url: cloudinaryResource.secure_url,
         providerPublicId: cloudinaryResource.public_id,
         userId: userId,
         tweetId: tweet.id,
      })
   })

   await Promise.all(filePromises)

   return {
      // hello: tweetTransformer(tweet)
      tweet: tweetTransformer(tweet)
   }
})