/** @format */

import { PropsWithChildren, useState, useEffect } from 'react'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import Screen from '../components/layout/screen'
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  LogBox,
} from 'react-native'
import { primaryColor, secondaryFont } from '../config/variableStyle'
import Icon from 'react-native-vector-icons/Ionicons'
import brands, { brand } from '../shared/brands'
import AppDialog from '../components/common/app-dialog'
import Toast from 'react-native-toast-message'
import DeviceModal from '../components/screen/devices/device-modal'
import DeviceCard from '../components/screen/devices/device-card'
import deviceModel from '../models/deviceModel'

type props = PropsWithChildren<{
  navigation: NativeStackNavigationProp<any>
}>

type device = {
  model: string
  brand: brand
  pricePerHour: number
}

// const devices: device[] = [
//   {
//     model: 'S-1324',
//     brand: brands[0],
//     pricePerHour: 5,
//   },
//   {
//     model: 'Y-256',
//     brand: brands[1],
//     pricePerHour: 6,
//   },
//   {
//     model: 'Note 8',
//     brand: brands[2],
//     pricePerHour: 5,
//   },
//   {
//     model: 'H S8',
//     brand: brands[3],
//     pricePerHour: 5,
//   },
//   {
//     model: 'Y-256',
//     brand: brands[1],
//     pricePerHour: 6,
//   },
//   {
//     model: 'Note 8',
//     brand: brands[2],
//     pricePerHour: 5,
//   },
//   {
//     model: 'H S8',
//     brand: brands[3],
//     pricePerHour: 5,
//   },
// ]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Devices: React.FC<props> = ({ navigation }) => {
  LogBox.ignoreLogs([/NativeEventEmitter/])
  const [showModal, setshowModal] = useState<boolean>(false)
  const [loading, setloading] = useState<boolean>(true)
  const [deviceList, setdeviceList] = useState<any>([])
  const [mode, setMode] = useState<'edit' | 'add'>('add')
  const [selectedDevice, setselectedDevice] = useState<device>({
    brand: {
      id: 0,
      image: '',
      name: '',
    },
    model: '',
    pricePerHour: 0,
  })
  const [showDialog, setshowDialog] = useState<boolean>(false)
  const [dialog, setDialog] = useState<{
    title: 'Deleting Device' | ''
    message: string
    button: {
      confirm: string
      cancel: string
    }
  }>({
    title: '',
    message: '',
    button: {
      confirm: 'Confirm',
      cancel: 'Cancel',
    },
  })

  useEffect(() => {
    getDevice()
  }, [])

  useEffect(() => {
    if (!loading) {
      console.log(deviceList)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  const getDevice = async () => {
    setloading(true)
    try {
      const conn = await deviceModel.connection()
      const list = await conn?.objects('Devices')
      // let list = await deviceModel.all()
      const data = list?.sorted('id', true).filtered('deleted == null')
      deviceModel.close()

      console.log(data)
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
    <Screen title='Devices'>
      <AppDialog
        text={dialog.message}
        visible={showDialog}
        title={dialog.title}
        confirmRed={dialog.title === 'Deleting Device' && true}
        btnTextBottom={{
          cancel: dialog.button.cancel,
          confirm: dialog.button.confirm,
        }}
        onCancel={() => {
          setshowDialog(false)
        }}
        onConfirm={() => {
          setshowDialog(false)
          if (dialog.title === 'Deleting Device') {
            Toast.show({
              type: 'success',
              text1: 'Device',
              text2: `${selectedDevice.model} is successfully deleted`,
            })
          }
        }}
        onClose={() => {
          setshowDialog(false)
        }}
      />
      <DeviceModal
        selectedDevice={mode === 'edit' ? selectedDevice : null}
        visible={showModal}
        onConfirm={(response) => {
          let title: 'Device' | 'Price Update',
            content = ''
          if (response === 'success') {
            if (mode === 'add') {
              title = 'Device'
              content = 'Add device successfully'
            } else {
              title = 'Price Update'
              content = `Price update for ${selectedDevice.brand.name} ${selectedDevice.model}`
            }
          } else {
            if (mode === 'add') {
              title = 'Device'
              content = 'Failed to add device'
            } else {
              title = 'Price Update'
              content = `Failed to update price`
            }
          }
          Toast.show({
            type: response,
            text1: title,
            text2: content,
          })
          setshowModal(false)
        }}
        onClose={() => {
          setshowModal(false)
        }}
        onCancel={() => {
          setshowModal(false)
        }}
      />
      <View style={styles.rentedContainer}>
        <View style={styles.header}>
          <Text style={styles.cardHeader}>Rented Devices</Text>
          <TouchableOpacity
            onPress={() => {
              setshowModal(true)
              setMode('add')
            }}>
            <Icon
              name='ios-add-circle'
              size={30}
              color={primaryColor}
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          // indicatorStyle='black'
          showsVerticalScrollIndicator={false}
          // eslint-disable-next-line react-native/no-inline-styles
          contentContainerStyle={{
            gap: 15,
            paddingBottom: 15,
            paddingTop: 10,
            paddingHorizontal: 10,
            flex: deviceList.length === 0 ? 1 : 0,
          }}>
          {deviceList.map((item: any) => (
            <DeviceCard
              key={item.id}
              device={item}
              onEdit={() => {
                setselectedDevice(item)
                setMode('edit')
                setshowModal(true)
              }}
              onDelete={() => {
                setselectedDevice(item)
                setDialog({
                  message: `Are you sure you want to delete ${item.brand.name} ${item.model}?`,
                  title: 'Deleting Device',
                  button: {
                    cancel: 'Cancel',
                    confirm: 'Delete',
                  },
                })

                setshowDialog(true)
              }}
            />
          ))}
          {deviceList.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                // height: 300,
              }}>
              <Icon
                name='ios-file-tray'
                size={100}
                color={primaryColor}
                style={{ opacity: 0.5 }}
              />
              <Text
                style={{
                  fontFamily: secondaryFont.regular,
                  color: primaryColor,
                  fontSize: 18,
                }}>
                No device yet
              </Text>
            </View>
          ) : (
            <Text style={styles.label}>
              Devices: <Text style={styles.number}>{deviceList.length}</Text>
            </Text>
          )}
        </ScrollView>
      </View>
    </Screen>
  )
}

export default Devices

const styles = StyleSheet.create({
  rentedContainer: {
    // width: '100%',
    // marginBottom: 'auto',
    flex: 1,
  },
  cardHeader: {
    fontSize: 20,
    color: primaryColor,
    marginBottom: 5,
    fontFamily: secondaryFont.bold,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 18,
    paddingHorizontal: 10,
    color: primaryColor,
    fontFamily: secondaryFont.bold,
    paddingBottom: 10,
  },
  number: {
    fontFamily: secondaryFont.regular,
    fontSize: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
})
