import { cassa } from '../config'
import { createSource, createCustomer } from '../utils/stripe'
import { schema } from '../schema'



/**
 *
 *
 * Add payment information to stripe and db. If new user, create new stripe
 * customer, otherwise just update the stripe source
 *
 *
 * @param req
 * @param res
 *
 */
const addOrUpdatePayment = async (req, res) => {
  let token = req.body;


  // * (1) If user already has Stripe ID, update payment
  // If the user has a Stripe customer ID in the database,
  // then we know they have added payment information at least once.
  // If the customer ID exists, then we just update the card and return.

  let user
  try {
    user = await cassa.instance.user.findOneAsync({
      id: cassa.uuidFromString(req.user.id)
    })
  } catch (error) {
    return schema(res, 500, 'Error querying user.')
  }
  if (user.customer_id) {
    const source = await createSource(token.id, customer.id)
    if (source) return schema(res, 200, 'Payment update successful.')
    else return schema(res, 500, 'Error updating payment.')
  }


  // * (2) Otherwise, create a Stripe customer
  // If we've reached this, then the user does has not added
  // a payment method already.
  //
  // Therefore, we must create a new Stripe customer, which then
  // allows us to add a payment source. A source exists on a Stripe
  // customer object and provides access to payment features.

  let customer
  try {
    const options = { email: req.user.email }
    customer = await createCustomer(options)
  } catch (error) {
    return schema(res, 500, 'Error creating new customer.')
  }


  // * (3) Then, add payment for created customer
  // Update user with newly create Stripe customer ID.
  // Finally, create a new payment source on the new Stripe
  // customer object.

  try {
  let user = new cassa.instance.user({
    id: cassa.uuidFromString(req.user.id),
    stripe_customer_id: [customer.id]
  })
  await user.saveAsync()
  } catch (error) {
  return schema(res, 500, 'Error updating user.')
  }

  // Create Stripe source
  const source = await createSource(token.id, customer.id)
  if (source) return schema(res, 200, 'Payment update successful.')
  else return schema(res, 500, 'Error updating payment.')
}



export default {
  addOrUpdatePayment: addOrUpdatePayment
}
