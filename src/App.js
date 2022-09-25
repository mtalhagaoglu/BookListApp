import 'react-native-gesture-handler'
import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { store, persistor } from '@/Store'
import ApplicationNavigator from '@/Navigators/Application'
import './Translations'
import { MenuProvider } from 'react-native-popup-menu'

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <MenuProvider>
        <ApplicationNavigator />
      </MenuProvider>
    </PersistGate>
  </Provider>
)

export default App
