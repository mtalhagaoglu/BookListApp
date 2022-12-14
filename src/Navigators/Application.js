import React from 'react'
import { SafeAreaView, StatusBar, TouchableOpacity,StyleSheet } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import { navigationRef } from './utils'
import { HomePage, BookDetails, BookForm } from '@/Containers'
import Add from '@/Assets/Images/Add.svg'

const Stack = createStackNavigator()

const ApplicationNavigator = () => {
  return (
    <SafeAreaView style={[StyleSheet.absoluteFill]}>
      <NavigationContainer ref={navigationRef}>
        <StatusBar />
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomePage}
            options={{
              title: 'Kütüphane',
              headerStyle: {
                backgroundColor: '#f4f4f4',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerRight: () => (
                <TouchableOpacity
                  style={{ marginRight: 20 }}
                  onPress={() => navigationRef.navigate('BookForm')}
                >
                  <Add fill="black" width={30} height={30} />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="BookDetails"
            component={BookDetails}
            options={{
              title: 'Kitap',
              headerStyle: {
                backgroundColor: '#f4f4f4',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen
            name="BookForm"
            component={BookForm}
            options={{
              title: 'Kitap Ekle',
              headerStyle: {
                backgroundColor: '#f4f4f4',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  )
}

export default ApplicationNavigator
