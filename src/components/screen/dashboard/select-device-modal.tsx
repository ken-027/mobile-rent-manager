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
import Model, { rentsSchema } from '../../../models'

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

  const makeUnavailable = async () => {
    try {
      const conn = await Model.connection()
      conn?.write(() => {
        const updateDevice: any = conn.objectForPrimaryKey(
          'Devices',
          selectedDevice.id,
        )
        updateDevice.available = false
      })
    } catch (error: any) {
      console.log(error.message)
    }
  }

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
        let response: 'success' | 'fail'
        try {
          const model = await Model.connection()
          let userModel: unknown, deviceModel: unknown

          await model?.write(() => {
            userModel = model.objects('Users').filtered('name == $0', user)[0]
            deviceModel = model.objectForPrimaryKey(
              'Devices',
              selectedDevice.id,
            )

            console.log(coinToSeconds(selectedDevice.pricePerHour, coins))

            model.create(rentsSchema.name, {
              device: deviceModel,
              user: userModel || {
                name: user,
                seconds: coinToSeconds(selectedDevice.pricePerHour, coins),
                coins: coins,
              },
              status: 'started',
            })

            makeUnavailable()
          })

          response = 'success'
        } catch (error: any) {
          response = 'fail'
          console.error(error.message)
        }

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
