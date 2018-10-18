import { cassa } from '../config'
import { schema } from '../schema'
import request from 'request'



/**
 *
 *
 * Send gift
 *
 *
 * TODO: Move gift costs to database
 * TODO: Add transient error retry to request
 * ? Maybe parallelize some things here and there
 * @param req
 * @param res
 *
 */
const sendGift = async (req, res) => {

  // * (1) Get gift cost
  // Gift costs are stored in the database so that they
  // may be changed independent of app

  let cost
  if (req.body.giftId === '1') cost = 30
  else return schema(res, 400, 'Unsupported gift item.')


  // * (2) Get token balance
  // Lookup amount of tokens user has. Users make purchases,
  // not channels, so we store in user table.

  let from
  try {
    let from = await cassa.instance.user.findOneAsync({
      id: cassa.uuidFromString(req.user.id)
    })
  } catch (error) {
    return schema(res, 500, 'Error querying user.')
  }
  if (from.token_balance < cost) {
    return schema(res, 401, 'Not enough tokens.')
  }


  // * (3) Assert channel exists
  // Make sure the channel the user is attempting to
  // gift to is actually a channel.

  let to
  try {
    to = await cassa.instance.channel.findOneAsync({
      id: cassa.uuidFromString(req.body.to)
    })
  } catch (error) {
    return schema(res, 500, 'Error querying channel.')
  }
  if (!to) {
    return schema(res, 404, 'Channel doesn\'t exist')
  }


  // * (4) Update with new balances
  // User is giving tokens to the channel, so the tokens
  // are subtracted from the user's balance and added to
  // the balance of the channel

  let fromBalance = from.token_balance - cost
  let toBalance = to.received_token_balance + cost

  let userQuery, channelQuery
  try {
    let user = cassa.instance.user({
      id:                       cassa.uuidFromString(req.user.id),
      token_balance:            fromBalance
    })

    let channel = cassa.instance.channel({
      id:                       cassa.uuidFromString(req.body.to),
      received_token_balance:   toBalance
    })

    userQuery = await user.saveAsync({ return_query: true })
    channelQuery = await channel.saveAsync({ return_query: true })

  } catch (error) {
    return schema(res, 500, 'Error creating queries.')
  }

  // Execute batch
  try {
    await cassa.instance.doBatchAsync([userQuery, channelQuery])
  } catch (error) {
    return schema(res, 500, 'Error updating balances.')
  }


  // * (5) POST to chat endpoint
  // POSTing to chat endpoing securely emits a gift
  // message to the relevant chat room.

  request.post({
    uri: `${process.env.CHAT_API_BASE_URL}/gift`,
    json: true,
    body: {
      roomKey:  req.body.to,
      to:       to.name,
      from:     from.name,
      giftId:   req.body.giftId
    }
  }, (error, response, body) => {

    // Pass-through
    // If it doesn't succeed it's not a big deal, but
    // we should probably retry
    console.error(error)
  })

  // Don't wait for the gift message to finish.
  res.send({ balance: fromBalance })
}



export default {
  sendGift: sendGift
}
