const errorSchema = (props) => {
  return {
    error: props,
    trace: null
  }
}

const successSchema = (props) => {
  return {
    message: props
  }
}

// TODO: make dynamic
const userSchema = (props) => {
  return {
    id: props.id,
    name: props.name && props.name[0],
    email: props.email && props.email[0],
    alias: props.aliases && props.aliases[0],
    channelId: props.channels && props.channels[0],
    cardOnFile: !!props.customer_id,
    tokenBalance: props.token_balance
  }
}

// TODO: make dynamic
const channelSchema = (props) => {
  return {
    // General
    id: props.id,
    name: props.name && props.name[0],
    alias: props.alias && props.alias[0],
    about: props.about && props.about[0],
    influence: props.influence,

    // Live
    is_live: props.is_live,
    live_title: props.title && props.title[0],
    live_view_count: props.live_view_count,
    start_time: props.start_time,

    // Me
    is_following: props.isFollowing,
    is_subscribed: props.isSubscribed,
    is_grace_period: props.isGracePeriod
  }
}

// TODO: make into messenger in separate module from api schema
// i.e., should maybe be a module for routing all
// messages, errors, etc.
// Will transform slowly
export const schema = (res, type, props) => {
  switch (type) {
    case 'user': return res.send(userSchema(props))
    case 'channel': return res.send(channelSchema(props))
    case 200: return res.send(successSchema(props))
    case 400: return res.status(400).send(errorSchema(props))
    case 401: return res.status(401).send(errorSchema(props))
    case 404: return res.status(404).send(errorSchema(props))
    case 500: return res.status(500).send(errorSchema(props))
  }
}
