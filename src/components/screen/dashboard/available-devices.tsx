/** @format */

import { StyleSheet, Text, View } from 'react-native'
import { useState, useEffect } from 'react'
import type { PropsWithChildren } from 'react'
import { primaryColor, secondaryFont } from '../../../config/variableStyle'
import { ScrollView } from 'react-native'
import Card from '../../common/card'
import SelectDeviceModal from './select-device-modal'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { toHour } from '../../../utils/format'
import brands from '../../../shared/brands'
import { device } from '../../../types'
import Model from '../../../models'
import Icon from 'react-native-vector-icons/Ionicons'
import { useIsFocused } from '@react-navigation/native'

type props = PropsWithChildren<{}>

const AvailableDevices: React.FC<props> = ({}) => {
  const isFocus = useIsFocused()

  const [showModal, setshowModal] = useState<boolean>(false)
  const [loading, setloading] = useState<boolean>(true)
  const [deviceList, setdeviceList] = useState<any>([])
  const [selectedDevice, setselectedDevice] = useState<device>({
    brand: {
      id: 0,
      image: '',
      name: '',
    },
    deleted: null,
    id: '',
    model: '',
    pricePerHour: 0,
  })

  useEffect(() => {
    getDevice()
  }, [isFocus, showModal])

  useEffect(() => {}, [loading, showModal])

  const onSelect = (item: device) => {
    setshowModal(true)
    setselectedDevice(item)
  }

  const getDevice = async () => {
    setloading(true)
    try {
      const conn = await Model.connection()
      const list = await conn?.objects('Devices')
      // let list = await Model.all()
      const data = list
        ?.sorted('dateAdded', true)
        .filtered('available == true && deleted == null')

      Model.close()

      setdeviceList(
        data?.map((item: any) => ({
          id: item.id,
          model: item.model,
          brand: brands[item.brand],
          pricePerHour: item.pricePerHour,
          deleted: item.deleted,
        })),
      )
      setloading(false)
    } catch (error: any) {
      console.error(error.message)
    }
  }

  return (
    <>
      <SelectDeviceModal
        visible={showModal}
        onConfirm={async (response) => {
          if (response === 'success') {
            Toast.show({
              type: 'success',
              text1: 'Rent Status',
              text2: `${selectedDevice.model} is started ${toHour(3000)} hours`,
            })
          } else {
            Toast.show({
              type: 'error',
              text1: 'Available Device',
              text2: `There's an error`,
            })
          }
          setshowModal(false)
        }}
        onClose={() => {
          setshowModal(false)
        }}
        onCancel={() => {
          setshowModal(false)
        }}
        selectedDevice={selectedDevice}
      />
      <View style={styles.cardContainer}>
        <Text style={styles.cardHeader}>Available Devices</Text>
        <ScrollView
          // indicatorStyle='white'
          showsHorizontalScrollIndicator={false}
          // eslint-disable-next-line react-native/no-inline-styles
          contentContainerStyle={{
            gap: 5,
            paddingHorizontal: 10,
            width: deviceList?.length ? 'auto' : '100%',
            justifyContent: deviceList?.length ? 'flex-start' : 'center',
          }}
          horizontal>
          {deviceList?.length ? (
            deviceList.map((item: device) => (
              <Card
                onPress={() => onSelect(item)}
                key={item.id}
                availableDevice={item}
              />
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <Icon
                name='ios-phone-portrait-outline'
                size={50}
                color={primaryColor}
                // eslint-disable-next-line react-native/no-inline-styles
                style={{ opacity: 0.8 }}
              />
              <Text style={styles.noData}>No available devices</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </>
  )
}

export default AvailableDevices

const styles = StyleSheet.create({
  cardContainer: {
    maxHeight: 120,
    // marginBottom: 5,
  },
  cardHeader: {
    fontSize: 20,
    color: primaryColor,
    marginBottom: 5,
    fontFamily: secondaryFont.bold,
    marginLeft: 10,
    paddingHorizontal: 10,
  },
  noDataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    paddingTop: 5,
  },
  noData: {
    fontFamily: secondaryFont.regular,
    color: primaryColor,
    fontSize: 16,
    marginTop: 5,
  },
})
