/** @format */

import { useState, useEffect } from 'react'
import { LogBox, StyleSheet, Text, View } from 'react-native'
import type { PropsWithChildren } from 'react'
import { primaryColor, secondaryFont } from '../../../config/variableStyle'
import { ScrollView } from 'react-native'
import RentedCard from '../../common/rented-card'
import ResumableUserModal from './resumable-user-modal'
import Toast from 'react-native-toast-message'
import brands from '../../../shared/brands'
import AppDialog from '../../common/app-dialog'
import notification from '../../../utils/notification'
import { AndroidImportance } from '@notifee/react-native'

type props = PropsWithChildren<{}>

type rent = {
  detail: {
    cost: number
    user: user
    device: device
    date: Date
  }
}

type device = {
  model: string
  brand: string
  image: string
}

type user = {
  name: string
  timeLeft: number
}

const users: user[] = [
  {
    name: 'User One',
    timeLeft: 5556,
  },
  {
    name: 'User Two',
    timeLeft: 1234,
  },
  {
    name: 'User Three',
    timeLeft: 1234,
  },
  {
    name: 'User One',
    timeLeft: 101255,
  },
]

const devices: device[] = [
  {
    model: 'S-1324',
    image: brands[0].image,
    brand: brands[0].name,
  },
  {
    model: 'Y-256',
    image: brands[1].image,
    brand: brands[1].name,
  },
  {
    model: 'Note 8',
    image: brands[2].image,
    brand: brands[2].name,
  },
  {
    model: 'H S8',
    image: brands[3].image,
    brand: brands[3].name,
  },
]

const rentList: rent[] = [
  {
    detail: {
      cost: 10,
      user: users[0],
      device: devices[0],
      date: new Date(),
    },
  },
  {
    detail: {
      cost: 10,
      device: devices[1],
      user: users[1],
      date: new Date(),
    },
  },
  {
    detail: {
      cost: 10,
      device: devices[2],
      user: users[2],
      date: new Date(),
    },
  },
  {
    detail: {
      cost: 10,
      device: devices[3],
      user: users[3],
      date: new Date(),
    },
  },
]

const RentedDevices: React.FC<props> = ({}) => {
  LogBox.ignoreLogs([/NativeEventEmitter/])

  const [showModal, setshowModal] = useState<boolean>(false)
  const [selectedRent, setselectedRent] = useState<rent>({
    detail: {
      cost: 0,
      date: new Date(),
      device: { brand: '', image: '', model: '' },
      user: { name: '', timeLeft: 0 },
    },
  })
  const [showDialog, setshowDialog] = useState<boolean>(false)
  const [dialog, setDialog] = useState<{
    title: 'Terminate' | 'Add Time' | 'Time Expired' | ''
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

  useEffect(() => {}, [showDialog, showModal])

  return (
    <>
      <AppDialog
        text={dialog.message}
        visible={showDialog}
        title={dialog.title}
        confirmRed={dialog.title === 'Terminate' && true}
        btnTextBottom={{
          cancel: dialog.button.cancel,
          confirm: dialog.button.confirm,
        }}
        onCancel={() => {
          setshowDialog(false)
          if (dialog.title === 'Time Expired') {
            Toast.show({
              type: 'success',
              text1: 'Device Rent',
              text2: `${selectedRent.detail.device.model} is available now`,
            })
          }
        }}
        onConfirm={() => {
          setshowDialog(false)
          if (dialog.title === 'Terminate') {
            notification(
              'Timer Stop',
              `${selectedRent.detail.device.model} is available now`,
              {
                id: 'default',
                name: 'default channel',
                priority: AndroidImportance.HIGH,
              },
            )
            Toast.show({
              type: 'success',
              text1: 'Device Rent',
              text2: `${selectedRent.detail.device.model} is available now`,
            })
          } else if (dialog.title === 'Time Expired') {
            setshowModal(true)
          }
        }}
        onClose={() => {
          setshowDialog(false)
        }}
      />
      <ResumableUserModal
        onConfirm={() => {
          setshowModal(false)
          Toast.show({
            type: 'success',
            text1: 'Rent Status',
            text2: `${selectedRent.detail.user?.name} is resumed`,
          })
        }}
        selectedDevice={selectedRent.detail.device}
        onClose={() => {
          setshowModal(false)
        }}
        onCancel={() => {
          setshowModal(false)
        }}
        selectedUser={selectedRent.detail.user}
        visible={showModal}
      />
      <View style={styles.rentedContainer}>
        <Text style={styles.cardHeader}>Rented Devices</Text>
        <ScrollView
          // indicatorStyle='black'
          showsVerticalScrollIndicator={false}
          // eslint-disable-next-line react-native/no-inline-styles
          contentContainerStyle={{
            gap: 15,
            paddingBottom: 15,
            paddingHorizontal: 10,
          }}>
          {rentList.map((item, index) => (
            <RentedCard
              onAdd={() => {
                setselectedRent(item)
                setshowModal(true)
              }}
              onPause={(timeRemaining: number) => {
                setselectedRent(item)
                if (timeRemaining <= 0) {
                  setDialog({
                    message: 'No time left. Please add to continue!',
                    title: 'Time Expired',
                    button: {
                      cancel: 'Remove',
                      confirm: 'Add Time',
                    },
                  })
                  setshowDialog(true)
                }
              }}
              onStop={() => {
                setDialog({
                  message: 'Are you sure you want to stop the timer?',
                  title: 'Terminate',
                  button: {
                    cancel: 'Cancel',
                    confirm: 'Stop',
                  },
                })
                setshowDialog(true)
              }}
              onRemove={() => console.log(item)}
              key={index}
              detail={item.detail}
            />
          ))}
        </ScrollView>
      </View>
    </>
  )
}

export default RentedDevices

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
    marginLeft: 10,
    paddingHorizontal: 10,
  },
})
