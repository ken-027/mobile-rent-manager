/** @format */

import type { ToastConfig } from 'react-native-toast-message'
import { BaseToast, ErrorToast } from 'react-native-toast-message'
import { StyleSheet } from 'react-native'
import {
  greenColor,
  orangeColor,
  primaryColor,
  redColor,
  secondaryFont,
} from '../../config/variableStyle'

const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        borderLeftColor: greenColor,
        minHeight: 70,
        ...styles.boxShadow,
      }}
      // eslint-disable-next-line react-native/no-inline-styles
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),

  error: (props) => (
    <ErrorToast
      {...props}
      // eslint-disable-next-line react-native/no-inline-styles
      style={{ borderLeftColor: redColor, minHeight: 70, ...styles.boxShadow }}
      // eslint-disable-next-line react-native/no-inline-styles
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
  warning: (props) => (
    <ErrorToast
      {...props}
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        borderLeftColor: orangeColor,
        minHeight: 70,
        ...styles.boxShadow,
      }}
      // eslint-disable-next-line react-native/no-inline-styles
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
}

const styles = StyleSheet.create({
  text1: {
    fontSize: 18,
    fontWeight: undefined,
    color: primaryColor,
    fontFamily: secondaryFont.bold,
  },
  text2: {
    fontSize: 16,
    fontWeight: undefined,
    color: primaryColor,
    fontFamily: secondaryFont.regular,
  },
  boxShadow: {
    shadowColor: primaryColor,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
})

export default toastConfig
