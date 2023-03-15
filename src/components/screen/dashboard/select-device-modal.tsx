/** @format */

import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { PropsWithChildren, useEffect, useState } from 'react'
import AppModal from '../../common/app-modal'
import {
  borderColor,
  primaryColor,
  secondaryFont,
} from '../../../config/variableStyle'
import Card from '../../common/card'
import { device } from '../../../types'
import { toHour } from '../../../utils/format'
import coinToSeconds from '../../../utils/coinToSeconds'
import rentDevice from '../../../services/rentDevice'

type props = PropsWithChildren<{
  selectedDevice: device
  visible: boolean
  onConfirm: (response: 'success' | 'fail') => void
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
  // TODO: temporary here
  const [coins, setCoins] = useState<number>(selectedDevice.pricePerHour)
  const [user, setUser] = useState<string>('')
  // const [seconds, setSeconds] = useState<number>(
  //   coinToSeconds(selectedDevice.pricePerHour, coins),
  // )

  useEffect(() => {}, [])

  return (
    <AppModal
      title='Select Device'
      contentHeight={380}
      visible={visible}
      btnTextBottom={{
        confirm: 'Start',
        cancel: 'Cancel',
      }}
      onCancel={onCancel}
      onConfirm={async () => {
        const response = await rentDevice({
          userName: user,
          deviceId: selectedDevice.id,
          pricePerHour: selectedDevice.pricePerHour,
          coins: coins,
        })

        onConfirm(response)
      }}
      onClose={onClose}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <View style={{ flexBasis: '50%', gap: 10 }}>
          <View>
            <Text style={styles.label}>User</Text>
            <TextInput
              onChangeText={setUser}
              style={styles.input}
            />
          </View>
          <View>
            <Text style={styles.label}>Coins</Text>
            <TextInput
              keyboardType='numeric'
              onChangeText={(val) => setCoins(Number(val))}
              defaultValue={selectedDevice.pricePerHour.toString()}
              style={styles.input}
            />
          </View>
          <Text style={styles.timeLeft}>
            {toHour(
              coinToSeconds(
                selectedDevice.pricePerHour,
                coins || selectedDevice.pricePerHour,
              ),
            )}
            <Text style={styles.hours}> hour(s)</Text>
          </Text>
        </View>
        <View>
          <Text style={styles.labelSmall}>Selected Device</Text>
          <Card availableDevice={selectedDevice} />
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
    height: 'auto',
  },
  hours: {
    fontSize: 14,
    fontFamily: secondaryFont.regular,
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
    paddingHorizontal: 15,
    fontSize: 20,
    paddingVertical: 10,
    borderWidth: 1,
    fontFamily: secondaryFont.regular,
  },
  timeLeft: {
    fontSize: 35,
    color: primaryColor,
    fontFamily: secondaryFont.bold,
  },
  labelSmall: {
    color: primaryColor,
    fontSize: 16,
    fontFamily: secondaryFont.regular,
    marginBottom: 10,
  },
})
