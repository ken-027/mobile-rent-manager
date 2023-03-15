/** @format */

import { StyleSheet, Text, View } from 'react-native'
import { useState, useEffect } from 'react'
import type { PropsWithChildren } from 'react'
import { primaryColor, secondaryFont } from '../../../config/variableStyle'
import { ScrollView, Image } from 'react-native'
import Card from '../../common/card'
import SelectDeviceModal from './select-device-modal'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { toHour } from '../../../utils/format'
import { device } from '../../../types'
import { useIsFocused } from '@react-navigation/native'
import useFetch from '../../../hooks/useFetch'
import getDevice from '../../../services/getDevice'
import RealmPlugin from 'realm-flipper-plugin-device'
import Realm from 'realm'

type props = PropsWithChildren<{}>

const AvailableDevices: React.FC<props> = ({}) => {
  const isFocus = useIsFocused()

  const [showModal, setshowModal] = useState<boolean>(false)
  // const [loading, setloading] = useState<boolean>(true)
  const { loading, data, connection } = useFetch<device[]>(getDevice(true))
  // const [deviceList, setdeviceList] = useState<any>([])
  const [selectedDevice, setselectedDevice] = useState<device>({
    brand: 0,
    deleted: null,
    id: '',
    model: '',
    pricePerHour: 0,
    available: false,
    color: 0,
  })

  useEffect(() => {
    // getDevice()
  }, [isFocus, showModal])

  useEffect(() => {
    // console.log(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, showModal])

  const onSelect = (item: device) => {
    setshowModal(true)
    setselectedDevice(item)
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
        {!loading && <RealmPlugin realms={[connection as Realm]} />}

        <Text style={styles.cardHeader}>Available Devices</Text>
        <ScrollView
          // indicatorStyle='white'
          showsHorizontalScrollIndicator={false}
          // eslint-disable-next-line react-native/no-inline-styles
          contentContainerStyle={{
            gap: 5,
            paddingHorizontal: 10,
            width: data?.length ? 'auto' : '100%',
            justifyContent: data?.length ? 'flex-start' : 'center',
          }}
          horizontal>
          {data?.length ? (
            data.map((item: device) => (
              <Card
                onPress={() => onSelect(item)}
                key={item.id}
                availableDevice={item}
              />
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <Image
                style={{
                  height: '100%',
                }}
                resizeMode='contain'
                source={require('../../../assets/no-device.png')}
              />
              {/* <Text style={styles.noData}>No available devices</Text> */}
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
