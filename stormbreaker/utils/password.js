import crypto from 'crypto'
import bluebird from 'bluebird'



const pbkdf2 = bluebird.promisify(crypto.pbkdf2)
const randomBytes = bluebird.promisify(crypto.randomBytes)



/**
 *
 *
 *
 * @param password
 *
 */
export const hashPassword = async (password) => {
  try {
    const salt = await randomBytes(16)
    const hash = await pbkdf2(password, salt, 1e5, 32, 'sha512')
    return { salt: salt, hash: hash }
  } catch (error) {
    return null
  }
}



/**
 *
 *
 *
 * @param password
 *
 */
export const verifyPassword = async (password, hash, salt) => {
  try {
    const against = await pbkdf2(password, salt, 1e5, 32, 'sha512')
    return hash.toString('binary') === against.toString('binary')
  } catch (error) {
    return null
  }
}
