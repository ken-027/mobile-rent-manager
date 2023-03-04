/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useState, useRef, useEffect } from 'react'
import { StatusBar, useColorScheme, StyleSheet, AppState } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/Ionicons'
import { Colors } from 'react-native/Libraries/NewAppScreen'
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
// } from 'react-native-reanimated'

import Dashboard from './screens/dashboard'
import Devices from './screens/devices'
import Logs from './screens/logs'
import { primaryColor, secondaryColor } from './config/variableStyle'

function App(): JSX.Element {
  // const rotation = useSharedValue(0)

  // const animatedStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [{ rotateZ: `${40}` }],
  //   }
  // })
  const appState = useRef(AppState.currentState)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [visible, setvisible] = useState(appState.current)
  const isDarkMode = useColorScheme() === 'dark'
  const Tab = createBottomTabNavigator()

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : secondaryColor,
    flexBasis: '100%',
  }

  const { Navigator, Screen } = Tab

  useEffect(() => {
    const subs = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('app is in foreground')
      }

      appState.current = nextAppState
      setvisible(appState.current)
      console.log('App State', appState.current)
    })

    return () => {
      subs.remove()
    }
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <NavigationContainer>
        <Navigator
          initialRouteName='Devices'
          screenOptions={({ route }) => ({
            ...styles,
            headerShown: false,
            headerShadowVisible: false,
            tabBarShowLabel: false,
            // eslint-disable-next-line react/no-unstable-nested-components, @typescript-eslint/no-unused-vars
            tabBarIcon: ({ focused, color, size }) => {
              var iconName = ''
              var iconSize = 30

              switch (route.name) {
                case 'Logs':
                  iconName = focused ? 'ios-book' : 'ios-book-outline'
                  iconSize = focused ? 40 : iconSize
                  break

                case 'Devices':
                  iconName = focused
                    ? 'ios-phone-portrait'
                    : 'ios-phone-portrait-outline'
                  iconSize = focused ? 35 : iconSize
                  break

                default:
                  iconName = focused ? 'ios-grid' : 'ios-grid-outline'
                  iconSize = focused ? 40 : iconSize
                  break
              }

              return (
                // <Animated.View style={animatedStyle}>
                <Icon
                  name={iconName}
                  size={iconSize}
                  color={primaryColor}
                />
                // </Animated.View>
              )
            },
          })}>
          <Screen
            name='Devices'
            component={Devices}
          />
          <Screen
            name='Dashboard'
            component={Dashboard}
          />
          <Screen
            name='Logs'
            component={Logs}
          />
        </Navigator>
      </NavigationContainer>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: 'transparent',
  },
  tabBarStyle: {
    height: 50,
    // borderTopRightRadius: 20,
    // borderTopLeftRadius: 20,
    backgroundColor: secondaryColor,
  },
  container: {
    backgroundColor: secondaryColor,
    flex: 1,
  },
})

export default App
