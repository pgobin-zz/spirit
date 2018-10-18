import { takeLatest, all } from 'redux-saga/effects'
import API from '../Services/Api'
import FixtureAPI from '../Services/FixtureApi'
import DebugConfig from '../Config/DebugConfig'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { GithubTypes } from '../Redux/GithubRedux'
import { AuthTypes } from '../Redux/AuthRedux'
import { HomeTypes } from '../Redux/HomeRedux';
import { MeTypes } from '../Redux/MeRedux';
import { ChannelTypes } from '../Redux/ChannelRedux';

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { getUserAvatar } from './GithubSagas'
import { login, signup } from './AuthSagas'
import { getRecommended } from './HomeSagas'
import { me } from './MeSagas'
import { follow, goLive, unsubscribe, subscribe, getChannel } from './ChannelSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = DebugConfig.useFixtures ? FixtureAPI : API.create()

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),

    // some sagas receive extra parameters in addition to an action
    takeLatest(GithubTypes.USER_REQUEST, getUserAvatar, api),

    takeLatest(AuthTypes.LOGIN_REQUEST, login, api),

    takeLatest(AuthTypes.SIGNUP_REQUEST, signup, api),

    takeLatest(HomeTypes.RECOMMENDED_REQUEST, getRecommended, api),
    
    takeLatest(ChannelTypes.GO_LIVE_REQUEST, goLive, api),

    takeLatest(MeTypes.ME_REQUEST, me, api),

    takeLatest(ChannelTypes.FOLLOW_REQUEST, follow, api),

    takeLatest(ChannelTypes.SUBSCRIBE_REQUEST, subscribe, api),

    takeLatest(ChannelTypes.CHANNEL_REQUEST, getChannel, api),


  ])
}
