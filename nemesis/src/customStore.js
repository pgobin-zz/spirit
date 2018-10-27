/*



Copyright 2018-2019 Vlogur, Inc.
All Rights Reserved.

NOTICE: All information contained herein is, and remains
the property of Vlogur, Inc. and its suppliers, if any.

The intellectual and technical concepts contained
herein are proprietary to Vlogur Inc and its suppliers and may be
covered by U.S. and Foreign Patents, patents in process, and are
protected by trade secret or copyright law. Dissemination of this
information or reproduction of this material is strictly forbidden
unless prior written permission is obtained from Vlogur, Inc. */


import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';


import sagas from './sagas';
import reducers from './redux';


export const create = () => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(reducers, compose(applyMiddleware(sagaMiddleware)));

  sagaMiddleware.run(sagas);
  return store;
}


// export createCustomStore;
