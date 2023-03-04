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
// import Dialog from '../../common/dialog'

type props = PropsWithChildren<{}>

type device = {
  model: string
  brand: string
  image: string
}

const devices: device[] = [
  {
    model: 'S-1324',
    brand: brands[0].name,
    image: brands[0].image,
  },
  {
    model: 'Y-256',
    brand: brands[1].name,
    image: brands[1].image,
  },
  {
    model: 'Redmi Note 8',
    brand: brands[2].name,
    image: brands[2].image,
  },
  {
    model: 'H S8',
    brand: brands[3].name,
    image: brands[3].image,
  },
]

const AvailableDevices: React.FC<props> = ({}) => {
  const [showModal, setshowModal] = useState<boolean>(false)
  const [selectedDevice, setselectedDevice] = useState<device>({
    image: '',
    model: '',
    brand: '',
  })

  useEffect(() => {}, [showModal])

  const onSelect = (item: device) => {
    setshowModal(true)
    setselectedDevice({
      brand: item.brand,
      image: item.image,
      model: item.model,
    })
  }

  return (
    <>
      <SelectDeviceModal
        visible={showModal}
        onConfirm={() => {
          Toast.show({
            type: 'success',
            text1: 'Rent Status',
            text2: `${selectedDevice.model} is started ${toHour(3000)} hours`,
          })
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
          contentContainerStyle={{ gap: 15, paddingHorizontal: 10 }}
          horizontal>
          {devices.map((item, index) => (
            <Card
              onPress={() => onSelect(item)}
              key={index}
              availableDevice={{
                model: item.model,
                brand: item.brand,
                image: item.image,
              }}
            />
          ))}
        </ScrollView>
      </View>
    </>
  )
}

export default AvailableDevices

const styles = StyleSheet.create({
  cardContainer: {
    maxHeight: 120,
    marginBottom: 5,
  },
  cardHeader: {
    fontSize: 20,
    color: primaryColor,
    marginBottom: 5,
    fontFamily: secondaryFont.bold,
    marginLeft: 10,
    paddingHorizontal: 10,
  },
})
