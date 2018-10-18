import { stripe } from '../config'



/**
 *
 *
 * Create Stripe payment source on customer object.
 *
 *
 * @param tokenId
 * @param customerId
 *
 */
export const createSource = async (tokenId, customerId) => {
  try {
    return await stripe.customers.createSource(customerId, { source: tokenId })
  } catch (error) {
    return null
  }
}



/**
 *
 *
 * Create Stripe customer object.
 *
 *
 * @param options
 *
 */
export const createCustomer = async (options) => {
  try {
    return await stripe.customers.create(options)
  } catch (error) {
    return null
  }
}



/**
 *
 *
 * Renew Stripe subscription using existing subscription ID
 *
 *
 * @param subscriptionId
 *
 */
export const renewSubscription = async (subscriptionId) => {
  try {
    return await stripe.subscriptions.update(
      subscriptionId,
      { cancel_at_period_end: false }
    )
  } catch (error) {
    return null
  }
}



/**
 *
 *
 * Create new Stripe subscription from customer ID
 *
 *
 * TODO: Get plans from somewhere
 * @param customerId
 *
 */
export const createSubscription = async (customerId) => {
  try {
    return await stripe.subscriptions.create({
      customer: customerId,
      items: [{ plan: 'plan_D531UJwjewIs6W' }]
    })
  } catch (error) {
    return null
  }
}



/**
 *
 *
 * Remove Stripe subscription
 *
 *
 * @option at_period_end - keeps subscription valid until payment period ends
 * @param subscriptionId
 *
 */
export const removeSubscription = async (subscriptionId) => {
  try {
    return await stripe.subscriptions.del(subscriptionId, { at_period_end: true })
  } catch (error) {
    return null
  }
}



/**
 *
 *
 * Remove Stripe subscription
 *
 *
 * @option at_period_end - keeps subscription valid until payment period ends
 * @param subscriptionId
 *
 */
export const createCharge = async (options) => {
  try {
    return await stripe.charges.create(options)
  } catch (error) {
    return null
  }
}
