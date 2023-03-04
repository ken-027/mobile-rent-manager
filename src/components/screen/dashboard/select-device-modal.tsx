/** @format */

import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { PropsWithChildren } from 'react'
import AppModal from '../../common/app-modal'
import {
  borderColor,
  primaryColor,
  secondaryFont,
} from '../../../config/variableStyle'
import Card from '../../common/card'

type props = PropsWithChildren<{
  selectedDevice: {
    model: string
    brand: string
    image: string
  }
  visible: boolean
  onConfirm: any
  onClose: any
  onCancel: any
}>

const SelectDeviceModal: React.FC<props> = ({
  selectedDevice,
  visible,
  onClose,
  onConfirm,
  onCancel,
}) => {
  return (
    <AppModal
      title='Select Device'
      visible={visible}
      onCancel={onCancel}
      onConfirm={onConfirm}
      onClose={onClose}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <View style={{ flexBasis: '50%', gap: 10 }}>
          <View>
            <Text style={styles.label}>User</Text>
            <TextInput style={styles.input} />
          </View>
          <View>
            <Text style={styles.label}>Coins</Text>
            <TextInput
              keyboardType='numeric'
              style={styles.input}
            />
          </View>
        </View>
        <View>
          <Text style={styles.labelSmall}>Selected Device</Text>
          <Card
            availableDevice={{
              brand: selectedDevice.brand,
              model: selectedDevice.model,
              image: selectedDevice.image,
            }}
          />
        </View>
      </ScrollView>
    </AppModal>
  )
}

export default SelectDeviceModal

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  label: {
    color: primaryColor,
    fontFamily: secondaryFont.regular,
    paddingBottom: 10,
    fontSize: 18,
  },
  input: {
    borderColor: borderColor,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    padding: 5,
    borderWidth: 1,
    fontFamily: secondaryFont.regular,
  },
  labelSmall: {
    color: primaryColor,
    fontSize: 16,
    fontFamily: secondaryFont.regular,
    marginBottom: 10,
  },
})
