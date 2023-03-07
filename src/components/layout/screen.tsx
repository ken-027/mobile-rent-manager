/**
 *
 * @format
 */

import { StyleSheet, Text, View } from 'react-native'
import {
  primaryColor,
  secondaryColor,
  secondaryFont,
} from '../../config/variableStyle'
import type { PropsWithChildren } from 'react'

import toastConfig from '../common/toast-config'
import Toast from 'react-native-toast-message'

type props = PropsWithChildren<{
  children?: React.ReactNode
  title: string
}>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Screen: React.FC<props> = ({ children, title }) => {
  return (
    <View style={styles.container}>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <Text style={styles.header}>{title}</Text>
      {children}
      <Toast
        position='bottom'
        bottomOffset={20}
        config={toastConfig}
      />
    </View>
  )
}

export default Screen

const styles = StyleSheet.create({
  container: {
    flexBasis: '100%',
    flex: 1,
    // alignItems: 'center',
    // paddingHorizontal: 10,
    paddingTop: 2,
    backgroundColor: secondaryColor,
  },
  header: {
    color: primaryColor,
    fontSize: 25,
    textAlign: 'center',
    fontFamily: secondaryFont.extraBold,
    // marginBottom: 0,
  },
})
