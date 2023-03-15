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
  Image,
} from 'react-native'
import { primaryColor, secondaryFont } from '../config/variableStyle'
import Icon from 'react-native-vector-icons/Ionicons'
import AppDialog from '../components/common/app-dialog'
import Toast from 'react-native-toast-message'
import DeviceModal from '../components/screen/devices/device-modal'
import DeviceCard from '../components/screen/devices/device-card'
import Model from '../models'
import { device } from '../types'
import getDevice from '../services/getDevice'
import useFetch from '../hooks/useFetch'
import Loading from '../components/common/loading'

type props = PropsWithChildren<{
  navigation: NativeStackNavigationProp<any>
}>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Devices: React.FC<props> = ({ navigation }) => {
  LogBox.ignoreLogs([/NativeEventEmitter/])
  const [showModal, setshowModal] = useState<boolean>(false)
  // const [loading, setloading] = useState<boolean>(true)
  // const [deviceList, setdeviceList] = useState<any>([])
  const { loading, data } = useFetch<device[]>(getDevice())
  const [mode, setMode] = useState<'edit' | 'add'>('add')
  const [statusResponse, setstatusResponse] = useState<'success' | ''>('')
  const [selectedDevice, setselectedDevice] = useState<device>({
    brand: 0,
    color: 0,
    model: '',
    pricePerHour: 0,
    id: '',
    deleted: null,
    available: false,
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

  useEffect(() => {}, [])
  useEffect(() => {}, [statusResponse])

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
        onConfirm={async () => {
          setshowDialog(false)
          if (dialog.title === 'Deleting Device') {
            Toast.show({
              type: 'success',
              text1: 'Device',
              text2: `${selectedDevice.model} is successfully deleted`,
            })
            try {
              const conn = await Model.connection()

              conn?.write(() => {
                const updateDevice: any = conn.objectForPrimaryKey(
                  'Devices',
                  selectedDevice.id,
                )

                updateDevice.deleted = new Date()
              })
              setstatusResponse('success')
            } catch (error: any) {
              console.error(error.message)
            }
          }
          setstatusResponse('')
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
              content = `Price update for ${selectedDevice.brand} ${selectedDevice.model}`
            }
            setstatusResponse('success')
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
          setstatusResponse('')
        }}
        onClose={() => {
          setshowModal(false)
        }}
        onCancel={() => {
          setshowModal(false)
        }}
      />
      {/* <View style={styles.rentedContainer}> */}
      {loading ? (
        <Loading />
      ) : (
        <ScrollView
          // indicatorStyle='black'
          showsVerticalScrollIndicator={false}
          // eslint-disable-next-line react-native/no-inline-styles
          contentContainerStyle={{
            gap: 5,
            paddingBottom: 15,
            paddingTop: 10,
            paddingHorizontal: 10,
            flex: data?.length === 0 ? 1 : 0,
          }}>
          <View style={styles.header}>
            <Text style={styles.cardHeader}>Devices</Text>
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

          {data
            ? data.map((item: any) => (
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
              ))
            : null}
          {data ? (
            data.length === 0 ? (
              <View style={styles.noDataContainer}>
                <Image
                  source={require('../assets/no-device.png')}
                  resizeMode='contain'
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    width: '90%',
                  }}
                />
                <Text style={styles.noDataText}>No device yet</Text>
              </View>
            ) : (
              <Text style={styles.label}>
                Devices: <Text style={styles.number}>{data.length}</Text>
              </Text>
            )
          ) : null}
        </ScrollView>
      )}
      {/* </View> */}
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
    // paddingHorizontal: 10,
  },
  label: {
    fontSize: 18,
    marginTop: 10,
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
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // height: 300,
  },
  noDataText: {
    fontFamily: secondaryFont.regular,
    color: primaryColor,
    marginTop: 10,
    fontSize: 18,
  },
})
