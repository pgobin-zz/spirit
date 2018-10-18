// a library to wrap and simplify api calls
import apisauce from 'apisauce'

// our "constructor"
// const create = (baseURL = 'https://api.github.com/') => {
const create = (baseURL = 'http://192.168.0.3:5000/v1.0') => {
  // ------
  // STEP 1
  // ------
  //
  // Create and configure an apisauce-based api object.
  //
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // here are some default headers
    headers: {
      'Cache-Control': 'no-cache'
    },
    // 10 second timeout...
    // timeout: 10000

    // Dev long timeout for testing
    timeout: 999999,

    // Used to control what is an error and not
    // Not sure if working?
    validateStatus: (status) => {
      return status >= 200 && status < 500;
    }
  })

  // ------
  // STEP 2
  // ------
  //
  // Define some functions that call the api.  The goal is to provide
  // a thin wrapper of the api layer providing nicer feeling functions
  // rather than "get", "post" and friends.
  //
  // I generally don't like wrapping the output at this level because
  // sometimes specific actions need to be take on `403` or `401`, etc.
  //
  // Since we can't hide from that, we embrace it by getting out of the
  // way at this level.
  //
  const getRoot = () => api.get('')
  const getRate = () => api.get('rate_limit')

  // User
  const getUser = (username) => api.get('search/users', {q: username})

  // Auth
  const login = (creds) => api.post('login', creds)
  const signup = (newUserInfo) => api.post('users', newUserInfo)

  // Me
  const me = () => api.get('me')
  const getRecommended = () => api.get('me/recommended')

  // Live
  const goLive = (liveOptions) => api.post('me/live', liveOptions)
  
  // Channel
  const follow = (body) => api.post('me/following', body)
  const subscribe = (body) => api.post('me/subscriptions', body)
  const getChannel = (id) => api.get(`${id}`)
  const search = (query) => api.post('', { q: query })



  // ------
  // STEP 3
  // ------
  //
  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  // methods in step 2.
  //
  // Notice we're not returning back the `api` created in step 1?  That's
  // because it is scoped privately.  This is one way to create truly
  // private scoped goodies in JavaScript.
  //
  return {
    // a list of the API functions from step 2
    getRoot,
    getRate,
    getUser,
    login,
    signup,
    me,
    getRecommended,
    goLive,
    follow,
    subscribe,
    getChannel,
    search
  }
}

// let's return back our create method as the default.
export default {
  create
}
