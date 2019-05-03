import React from 'react';
import MainPage from './MainPage';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers} from 'redux'
import { ReactReduxFirebaseProvider, firebaseReducer } from 'react-redux-firebase'
import { createFirestoreInstance, firestoreReducer } from 'redux-firestore' // <- needed if using firestore
import firebase from './firebase'
import "antd/dist/antd.css"

import { reducer as localReducer, initialState as localInitial } from './localReducer'

// react-redux-firebase config
const rrfConfig = {
  userProfile: null,
  logErrors: false
  //useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
}

// Initialize other services on firebase instance
//const fireStore= firebase.firestore() // <- needed if using firestore
firebase.functions() // <- needed if using httpsCallable

// Add firebase to reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer, // <- needed if using firestore
  localState: localReducer
  
})// Add firebase to reducers

// Create store with reducers and initial state
const initialState = {
  localState:localInitial}
const store = createStore(rootReducer, initialState)

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance // <- needed if using firestore
}

render(<Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <MainPage />
    </ReactReduxFirebaseProvider>
  </Provider>, document.getElementById('root'));
