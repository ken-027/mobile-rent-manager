/** @format */

import { useState, useEffect } from 'react'
import { LogBox, StyleSheet, Text, View, Image } from 'react-native'
import type { PropsWithChildren } from 'react'
import { primaryColor, secondaryFont } from '../../../config/variableStyle'
import RentedCard from '../../common/rented-card'
import ResumableUserModal from './resumable-user-modal'
import Toast from 'react-native-toast-message'
import AppDialog from '../../common/app-dialog'
import notification from '../../../utils/notification'
import { AndroidImportance } from '@notifee/react-native'
import Model, { rentsSchema } from '../../../models'
import { rent } from '../../../types'
import brands from '../../../shared/brands'

type props = PropsWithChildren<{}>

const RentedDevices: React.FC<props> = ({}) => {
  LogBox.ignoreLogs([/NativeEventEmitter/])

  const [showDialog, setshowDialog] = useState<boolean>(false)
  const [isRefresh, setisRefresh] = useState<boolean>(false)
  const [showModal, setshowModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [rentList, setrentList] = useState<rent[]>([])
  const [selectedRent, setselectedRent] = useState<rent>({
    id: '',
    dateAdded: new Date(),
    dateUpdated: new Date(),
    device: {
      brand: 0,
      available: false,
      deleted: null,
      id: '',
      model: '',
      pricePerHour: 0,
      color: 0,
    },
    status: 'stopped',
    user: {
      id: '',
      name: '',
    },
    coins: 0,
    seconds: 0,
  })

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

  useEffect(() => {
    getRents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRefresh])

  useEffect(() => {
    // console.log(rentList)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDialog, showModal, loading])

  const onRefresh = () => setisRefresh((prevState) => !prevState)

  const getRents = async () => {
    setLoading(true)
    try {
      const rentModel = await Model.connection()
      const list = await rentModel
        ?.objects<rent>(rentsSchema.name)
        .filtered(
          `device.available == $0 && status != 'removed' && device.deleted == null`,
          false,
        )
      // console.log(list?.length)
      // Model.close()
      if (list) {
        setrentList(
          list.map((item: rent) => ({
            id: item.id,
            dateAdded: item.dateAdded,
            dateUpdated: item.dateUpdated,
            device: item.device && {
              brand: {
                id: brands[Number(item.device.brand)].id,
                image: brands[Number(item.device.brand)]?.image,
                name: brands[Number(item.device.brand)]?.name,
              },
              deleted: item?.device.deleted,
              available: item.device.available,
              id: item.device.id,
              model: item.device.model,
              pricePerHour: item.device.pricePerHour,
            },
            status: item.status,
            user: {
              id: item.user.id,
              coins: item.user.coins,
              seconds: item.user.seconds,
              name: item.user.name,
            },
          })),
        )
      }
    } catch (error: any) {
      console.error(error.message)
    }
    setLoading(false)
  }

  const remove = async () => {
    let success = false

    try {
      const conn = await Model.connection()

      await conn?.write(() => {
        const rentModel = conn.objectForPrimaryKey<any>(
          rentsSchema.name,
          selectedRent.id,
        )

        if (rentModel) {
          rentModel.user.seconds = 0
          rentModel.status = 'stopped'
          rentModel.dateUpdated = new Date()

          if (rentModel.device) {
            rentModel.device.available = true
          }

          rentModel.device = null
        }
      })

      success = true
      onRefresh()
    } catch (error: any) {
      console.error(error.message)
    }
    if (success) {
      notification(
        'Timer Stop',
        `${selectedRent.device?.model} is available now`,
        {
          id: 'default',
          name: 'default channel',
          priority: AndroidImportance.HIGH,
        },
      )
      Toast.show({
        type: 'success',
        text1: 'Device Rent',
        text2: `${selectedRent?.device?.model} is available now`,
      })
    }
  }

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
        onCancel={async () => {
          setshowDialog(false)
          if (dialog.title === 'Time Expired') {
            remove()
          }
        }}
        onConfirm={async () => {
          setshowDialog(false)
          if (dialog.title === 'Terminate') {
            remove()
          } else if (dialog.title === 'Time Expired') {
            setshowModal(true)
          }
        }}
        onClose={() => {
          setshowDialog(false)
        }}
      />
      <ResumableUserModal
        onConfirm={(response) => {
          if (response === 'success') {
            onRefresh()
            setshowModal(false)
            Toast.show({
              type: 'success',
              text1: 'Rent Status',
              text2: `${selectedRent?.user.name} is resumed`,
            })
          }
        }}
        selectedRent={selectedRent}
        onClose={() => {
          setshowModal(false)
        }}
        onCancel={() => {
          setshowModal(false)
        }}
        selectedUser={{
          name: selectedRent.user.name,
          coins: selectedRent?.user.coins,
          seconds: selectedRent?.user.seconds,
          id: selectedRent?.user.id,
        }}
        visible={showModal}
      />
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          ...styles.rentedContainer,
          height: rentList.length ? 'auto' : 300,
        }}>
        <Text style={styles.cardHeader}>Rented Devices</Text>
        {rentList.length ? (
          rentList.map((item: rent) => {
            return (
              <RentedCard
                onAdd={() => {
                  setselectedRent(item)
                  setshowModal(true)
                }}
                onPause={async (timeRemaining: number) => {
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
                  } else {
                    try {
                      const conn = await Model.connection()

                      await conn?.write(() => {
                        const rentModel = conn.objectForPrimaryKey<rent>(
                          rentsSchema.name,
                          item.id,
                        )

                        if (rentModel) {
                          rentModel.status =
                            rentModel.status === 'paused' ? 'started' : 'paused'
                          rentModel.user.seconds = timeRemaining
                          rentModel.dateUpdated = new Date()
                        }
                      })
                      onRefresh()
                    } catch (error: any) {
                      console.error(error.message)
                    }
                  }
                }}
                onStop={() => {
                  setselectedRent(item)
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
                onRemove={async (timeLeft: number) => {
                  try {
                    const conn = await Model.connection()
                    conn?.write(() => {
                      const rentModel = conn.objectForPrimaryKey<rent>(
                        rentsSchema.name,
                        item.id,
                      )
                      if (rentModel) {
                        rentModel.status = 'removed'
                        rentModel.user.seconds = timeLeft
                        rentModel.dateUpdated = new Date()
                        if (rentModel.device) {
                          rentModel.device.available = true
                        }
                      }
                    })
                    onRefresh()
                  } catch (error: any) {
                    console.error(error.message)
                  }
                }}
                key={item.id}
                detail={item}
              />
            )
          })
        ) : (
          <View style={styles.noDataContainer}>
            <Image
              style={{ width: '50%' }}
              resizeMode='contain'
              source={require('../../../assets/no-rent.png')}
            />
            <Text style={styles.noDataText}>No rented devices</Text>
          </View>
        )}
      </View>
    </>
  )
}

export default RentedDevices

const styles = StyleSheet.create({
  rentedContainer: {
    paddingHorizontal: 10,
  },
  cardHeader: {
    fontSize: 20,
    color: primaryColor,
    marginBottom: 5,
    fontFamily: secondaryFont.bold,
    // marginLeft: 10,
    paddingHorizontal: 10,
  },
  noDataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    paddingTop: 5,
    flex: 1,
  },
  noDataText: {
    fontFamily: secondaryFont.regular,
    color: primaryColor,
    fontSize: 18,
    marginTop: 5,
  },
})
