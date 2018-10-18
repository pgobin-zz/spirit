import { cassa } from '../config'
import { createCharge } from '../utils/stripe'
import { schema } from '../schema'



/**
 *
 *
 * Buy tokens
 *
 *
 * TODO: Move cost lookup to database
 * TODO: Consolidate payment helper functions
 * TODO: Transient error retry + refund on fail
 * @param req
 * @param res
 *
 */
const buyTokens = async (req, res) => {
  if (!req.body.amount) {
    return schema(res, 400, 'Unsupported body.')
  }


  // * (1) Lookup token cost
  // Query database for what token costs in USD

  let cost
  if (req.body.amount === 50) {
    cost = 200
  } else {
    return schema(res, 400, 'Unsupported token denomination.')
  }


  // * (2) Assert user has payment info

  let user
  try {
    user = await cassa.instance.user.findOneAsync({
      id: cassa.uuidFromString(req.user.id)
    })
  } catch (error) {
    return schema(res, 500, 'Error querying user.')
  }
  if (!user.customer_id) {
    return schema(res, 401, 'Payment information not found.')
  }


  // * (3) Charge user

  const charge = await createCharge({
    amount: cost,
    currency: 'usd',
    customer: user.customer_id,
    description: `Purchase ${req.body.amount} tokens`
  })
  if (!charge) return schema(res, 500, 'Error performing charge.')


  // * (4) Update balance

  let balance = user.token_balance + req.body.amount

  try {
    let user = new cassa.instance.user({
      id: cassa.uuidFromString(req.user.id),
      token_balance: balance
    })
    await user.saveAsync()
  } catch (error) {
    return schema(res, 500, 'Error adding tokens.')
  }

  res.send({ balance: balance })
}



// /**
//  *
//  *
//  *
//  * @param req
//  * @param res
//  *
//  */
// export const getTokens = async (req, res) => {
//   let user
//   try {
//     user = await cassa.instance.user.findOneAsync({
//       id: cassa.uuidFromString(req.user.id)
//     })
//   } catch (error) {
//     return schema(res, 500, 'Error querying user.')
//   }

//   const query = `
//     SELECT token_balance
//     FROM user."_doc"
//     WHERE id = ?
//     `
//   let user
//   try {
//     user = await cassandra.execute(query, [req.user.id])
//     user = user.rows[0]
//   } catch (error) {
//     return schema(res, 500, 'Error performing lookup.')
//   }

//   res.send({ balance: user.token_balance })
// }



export default {
  buyTokens: buyTokens
}
