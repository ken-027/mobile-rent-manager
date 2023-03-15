/** @format */

import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native'
import type { PropsWithChildren } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import {
  borderColor,
  primaryColor,
  redColor,
  secondaryColor,
  secondaryFont,
} from '../../config/variableStyle'

type props = PropsWithChildren<{
  visible: boolean
  onClose: any
  onCancel: any
  onConfirm?: any
  title: string
  children?: React.ReactNode
  btnTextBottom?: {
    confirm: string
    cancel: string
    confirmRed?: boolean
    cancelRed?: boolean
  }
  contentHeight?: number
}>

const AppModal: React.FC<props> = ({
  visible,
  onClose,
  onCancel,
  title,
  btnTextBottom,
  children,
  onConfirm,
  contentHeight = 330,
}) => {
  return (
    <Modal
      transparent
      statusBarTranslucent
      animationType='fade'
      presentationStyle='overFullScreen'
      visible={visible}>
      <View style={styles.container}>
        <View style={{ ...styles.modalCard, minHeight: contentHeight }}>
          <View style={styles.cardHeader}>
            <Text style={styles.headerText}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon
                name='ios-close-circle'
                size={30}
                color={secondaryColor}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.cardContent}>
            {children || <Text style={styles.textContent}>Content here</Text>}
          </View>
          <View style={styles.cardFooter}>
            <TouchableOpacity
              onPress={onConfirm}
              style={styles.buttonAgree}>
              <Text
                style={{
                  ...styles.btnTextConfirm,
                  color: btnTextBottom?.confirmRed ? redColor : primaryColor,
                }}>
                {btnTextBottom?.confirm || 'Confirm'}
              </Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            {/* eslint-disable-next-line react-native/no-inline-styles */}
            <TouchableOpacity
              onPress={onCancel}
              style={styles.buttonCancel}>
              <Text
                style={{
                  ...styles.btnTextConfirm,
                  color: btnTextBottom?.cancelRed ? redColor : primaryColor,
                }}>
                {btnTextBottom?.cancel || 'Cancel'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default AppModal

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalCard: {
    backgroundColor: secondaryColor,
    width: '90%',
    maxWidth: 350,
    borderRadius: 20,
    height: 'auto',
    overflow: 'hidden',
  },
  cardHeader: {
    backgroundColor: primaryColor,
    height: 70,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontFamily: secondaryFont.bold,
    color: secondaryColor,
    fontSize: 20,
  },
  cardFooter: {
    height: 50,
    borderTopWidth: 1,
    borderColor: borderColor,
    flexDirection: 'row',
  },
  cardContent: {
    // padding: 20,
    flex: 1,
  },
  buttonAgree: {
    width: '50%',
    // backgroundColor: borderColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomStartRadius: 20,
  },
  buttonCancel: {
    width: '50%',
    // backgroundColor: borderColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomEndRadius: 20,
  },
  separator: { borderRightColor: borderColor, borderRightWidth: 1 },
  btnTextConfirm: {
    fontFamily: secondaryFont.bold,
    fontSize: 16,
    color: primaryColor,
  },
  textContent: {
    color: primaryColor,
    fontFamily: secondaryFont.bold,
    fontSize: 18,
    padding: 20,
  },
})
