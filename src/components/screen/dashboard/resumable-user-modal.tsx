/** @format */

import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { PropsWithChildren, useEffect, useState } from 'react'
import AppModal from '../../common/app-modal'
import {
  borderColor,
  primaryColor,
  secondaryColor,
  secondaryFont,
} from '../../../config/variableStyle'
import Card from '../../common/card'
import { toHour } from '../../../utils/format'
import Icon from 'react-native-vector-icons/Ionicons'
import { device, rent, user } from '../../../types'
import Model, { rentsSchema } from '../../../models'
import brands from '../../../shared/brands'
import coinToSeconds from '../../../utils/coinToSeconds'

type props = PropsWithChildren<{
  selectedUser: user
  selectedRent?: rent
  visible: boolean
  onConfirm: (response: 'success' | 'fail') => void
  onClose: any
  onCancel: any
}>

const ResumableUserModal: React.FC<props> = ({
  selectedUser,
  selectedRent,
  visible,
  onClose,
  onCancel,
  onConfirm,
}) => {
  const [addTime, setaddTime] = useState<number>(0)
  const [coins, setCoins] = useState<number>(0)
  const [selectedDevice, setselectedDevice] = useState<device>()
  const [deviceList, setdeviceList] = useState<any>([])

  useEffect(() => {
    getAvailableDevice()
  }, [])

  const getAvailableDevice = async () => {
    // setloading(true)
    try {
      const conn = await Model.connection()
      const list = await conn?.objects('Devices')
      // let list = await Model.all()
      const data = list
        ?.sorted('dateAdded', true)
        .filtered('available == true && deleted == null')

      // Model.close()

      setdeviceList(
        data?.map((item: any) => ({
          id: item.id,
          model: item.model,
          brand: brands[item.brand],
          pricePerHour: item.pricePerHour,
          deleted: item.deleted,
        })),
      )
      // setloading(false)
    } catch (error: any) {
      console.error(error.message)
    }
  }

  return (
    <AppModal
      title={selectedRent ? 'Add Time' : 'Resume Account'}
      visible={visible}
      onConfirm={async () => {
        let response: 'success' | 'fail' = 'fail'
        try {
          const conn = await Model.connection()

          await conn?.write(() => {
            const rentModel: any = conn.objectForPrimaryKey(
              rentsSchema.name,
              selectedRent?.id || '',
            )

            rentModel.user.seconds += addTime
            rentModel.user.coins += coins
          })

          response = 'success'
        } catch (error: any) {
          console.error(error.message)
        }
        onConfirm(response)
      }}
      btnTextBottom={{
        cancel: !selectedRent ? 'Remove' : 'Cancel',
        confirm: 'Resume',
        cancelRed: !selectedRent ? true : false,
      }}
      onCancel={onCancel}
      onClose={onClose}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.group}>
          <View>
            <Text style={styles.label}>
              {selectedRent ? 'Coins' : 'Add Coins'}
            </Text>
            <TextInput
              inputMode='numeric'
              keyboardType='numeric'
              defaultValue='0'
              onChangeText={(val) => {
                setCoins(Number(val))
                if (selectedRent) {
                  setaddTime(
                    coinToSeconds(
                      Number(selectedRent.device?.pricePerHour),
                      Number(val),
                    ),
                  )
                } else {
                  if (selectedDevice) {
                    setaddTime(
                      coinToSeconds(
                        Number(selectedDevice?.pricePerHour),
                        Number(val),
                      ),
                    )
                  }
                }
              }}
              style={styles.input}
            />
          </View>
          <View>
            <Text style={styles.timeLeft}>
              {toHour(selectedUser.seconds + addTime)}
              <Text style={styles.hours}> hour(s)</Text>
            </Text>
            <Text
              numberOfLines={2}
              ellipsizeMode='tail'
              style={styles.selectedUser}>
              {selectedUser?.name}
            </Text>
          </View>
        </View>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <View style={{ flex: 1, flexBasis: '50%', paddingTop: 20 }}>
          <Text style={styles.labelSmall}>
            {selectedRent ? 'Device that is using' : 'Select a Device'}
          </Text>
          {/* eslint-disable-next-line react-native/no-inline-styles */}
          <ScrollView contentContainerStyle={{ paddingTop: 10 }}>
            {selectedRent ? (
              <Card availableDevice={selectedRent.device as device} />
            ) : (
              deviceList.map((item: device) => (
                <View
                  key={item.id}
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{ position: 'relative' }}>
                  {selectedDevice?.id === item.id ? (
                    <Icon
                      style={styles.check}
                      name='ios-checkmark-circle'
                      size={30}
                      color={secondaryColor}
                    />
                  ) : null}
                  <Card
                    onPress={() => {
                      setselectedDevice(item)
                      setaddTime(
                        coinToSeconds(Number(item.pricePerHour), coins),
                      )
                    }}
                    availableDevice={item}
                  />
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </AppModal>
  )
}

export default ResumableUserModal

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    flex: 1,
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
  labelSmall: {
    color: primaryColor,
    fontSize: 16,
    fontFamily: secondaryFont.regular,
    // marginBottom: 10,
  },
  group: {
    flexBasis: '50%',
    gap: 10,
    padding: 20,
    paddingRight: 0,
  },
  timeLeft: {
    fontSize: 35,
    color: primaryColor,
    fontFamily: secondaryFont.bold,
  },
  hours: {
    fontSize: 14,
    fontFamily: secondaryFont.regular,
  },
  selectedUser: {
    fontSize: 20,
    color: primaryColor,
    marginTop: 2,
    fontFamily: secondaryFont.regular,
  },
  check: {
    position: 'absolute',
    top: 2,
    left: 2,
    zIndex: 10,
  },
})
