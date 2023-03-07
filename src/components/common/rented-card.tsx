/** @format */

import { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  DeviceEventEmitter,
  NativeAppEventEmitter,
  Platform,
  LogBox,
} from 'react-native'
import BackgroundTimer from 'react-native-background-timer'
import {
  greenColor,
  orangeColor,
  primaryColor,
  primaryFont,
  redColor,
  secondaryColor,
  secondaryFont,
} from '../../config/variableStyle'
import Icon from 'react-native-vector-icons/Ionicons'
import type { PropsWithChildren } from 'react'
import Toast from 'react-native-toast-message'
import {
  dateDiffToSecond,
  toDateTimeFormat,
  toHour,
  toSeconds,
} from '../../utils/format'
import notification from '../../utils/notification'
import { AndroidImportance } from '@notifee/react-native'
import { rent } from '../../types'
import Model, { rentsSchema } from '../../models'

type props = PropsWithChildren<{
  detail: rent
  onAdd: any
  onPause: (timeLeft: number) => void
  onRemove: (timeLeft: number) => void
  onStop: any
}>

const RentedCard: React.FC<props> = ({
  detail,
  onPause,
  onAdd,
  onRemove,
  onStop,
}) => {
  LogBox.ignoreLogs([/NativeEventEmitter/])

  const timeLeft = dateDiffToSecond(new Date(detail.dateAdded || ''))
  const [isRunning, setRunning] = useState<boolean>(detail.status === 'started')
  const [timeRemaining, settimeRemaining] = useState<number>(
    detail.user.seconds < timeLeft
      ? 0
      : detail.status === 'started'
      ? detail.user.seconds - timeLeft
      : detail.user.seconds,
  )

  useEffect(() => {
    const EventEmitter = Platform.select({
      ios: () => NativeAppEventEmitter,
      android: () => DeviceEventEmitter,
      default: () => DeviceEventEmitter,
    })()

    EventEmitter.addListener('backgroundTimer', () => {})

    const interval = BackgroundTimer.setInterval(() => {
      if (timeRemaining > 0) {
        if (isRunning) {
          settimeRemaining((prevState) => prevState - 1)
        }
      } else {
        setRunning(false)
      }
    }, 1000)

    if (!timeRemaining && !isRunning) {
      updateRent()
      toast()
      notification('Timer Stop', `${detail.device.model} timer has stop`, {
        id: 'default',
        name: 'default channel',
        priority: AndroidImportance.HIGH,
      })
    }
    return () => {
      BackgroundTimer.clearInterval(interval)
      EventEmitter.removeAllListeners('backgroundTimer')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining, isRunning])

  const toast = () => {
    Toast.show({
      type: 'error',
      text1: 'Time ended',
      text2: `${detail.device.model} has ended`,
    })
  }

  const updateRent = async () => {
    try {
      const conn = await Model.connection()
      conn?.write(() => {
        const rentModel: any = conn.objectForPrimaryKey(
          rentsSchema.name,
          detail.id,
        )

        rentModel.user.seconds = timeRemaining
      })
    } catch (error: any) {
      console.error(error.message)
    }
  }

  const togglePause = () => {
    onPause(timeRemaining)
    if (timeRemaining <= 0) {
      return false
    }

    if (isRunning) {
      BackgroundTimer.stop()
      Toast.show({
        type: 'warning',
        text1: 'Device Status',
        text2: `${detail.device.model} is pause`,
      })
    } else {
      BackgroundTimer.start()
      Toast.show({
        type: 'success',
        text1: 'Device Status',
        text2: `${detail.device.model} is running`,
      })
    }
    setRunning((prevState) => !prevState)
  }

  const remove = () => {
    onRemove(timeRemaining)
    Toast.show({
      type: 'success',
      text1: 'Device Rent',
      text2: `${detail.device.model} is available now`,
    })
  }

  const add = () => {
    // setshowModal(true)
    onAdd()
  }

  return (
    <>
      <View style={styles.card}>
        <TouchableHighlight
          onPress={togglePause}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{ flexBasis: '50%', maxWidth: 250 }}>
          <View style={styles.clockContainer}>
            <Image
              style={styles.clockImage}
              source={require('../../assets/clock.png')}
            />
            <Text style={styles.remainingTime}>remaining time</Text>
            <Text style={styles.hour}>{toHour(timeRemaining)}</Text>
            <Text style={styles.seconds}>{toSeconds(timeRemaining)}</Text>
            <View style={styles.buttonGroup}>
              {!isRunning ? (
                <TouchableOpacity onPress={add}>
                  <Icon
                    name='ios-add-circle'
                    size={30}
                    color={secondaryColor}
                  />
                </TouchableOpacity>
              ) : (
                ''
              )}

              <TouchableOpacity onPress={togglePause}>
                <Icon
                  name={`ios-${!isRunning ? 'play' : 'pause'}`}
                  size={30}
                  color={secondaryColor}
                />
              </TouchableOpacity>

              {!isRunning ? (
                <TouchableOpacity onPress={remove}>
                  <Icon
                    name='ios-remove-circle'
                    size={30}
                    color={secondaryColor}
                  />
                </TouchableOpacity>
              ) : (
                ''
              )}
            </View>
          </View>
        </TouchableHighlight>
        <View style={styles.detailContainer}>
          <Text
            numberOfLines={1}
            ellipsizeMode='tail'
            style={styles.modelName}>
            {`${detail.device.brand.name} ${detail.device.model}`}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode='tail'
            style={styles.renterName}>
            {detail.user.name}
          </Text>
          <Text style={styles.cost}>{detail.user.coins} pesos</Text>
          <Text
            numberOfLines={1}
            ellipsizeMode='tail'
            style={styles.date}>
            {toDateTimeFormat(detail.dateAdded as Date)}
          </Text>
          <View
            style={{
              ...styles.status,
              backgroundColor: isRunning
                ? greenColor
                : !timeRemaining
                ? redColor
                : orangeColor,
            }}
          />
          {!isRunning && timeRemaining ? (
            <TouchableOpacity
              style={styles.terminate}
              onPress={onStop}>
              <Icon
                name='ios-stop-circle'
                size={30}
                color={redColor}
              />
            </TouchableOpacity>
          ) : (
            ''
          )}
        </View>
      </View>
    </>
  )
}

export default RentedCard

const styles = StyleSheet.create({
  card: {
    backgroundColor: primaryColor,
    borderRadius: 20,
    justifyContent: 'center',
    marginBottom: 5,
    alignItems: 'center',
    position: 'relative',
    height: 150,
    overflow: 'hidden',
    padding: 1,
    flexDirection: 'row',
    shadowColor: primaryColor,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginTop: 2,
    elevation: 3,
  },
  clockImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
    aspectRatio: 1 / 1,
    opacity: 0.1,
    position: 'absolute',
  },
  clockContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    marginLeft: 2,
    borderTopLeftRadius: 20,
    position: 'relative',
    borderBottomLeftRadius: 20,
    padding: 10,
  },
  remainingTime: {
    color: secondaryColor,
    fontSize: 16,
    fontFamily: secondaryFont.regular,
  },
  seconds: {
    // fontSize: 20,
    fontFamily: primaryFont.medium,
    color: secondaryColor,
    transform: [{ scale: 1.3 }],
  },
  hour: {
    fontFamily: primaryFont.semi,
    color: secondaryColor,
    marginVertical: 15,
    includeFontPadding: false,
    transform: [{ scale: 3 }],
  },
  detailContainer: {
    backgroundColor: secondaryColor,
    // flexBasis: '50%',
    flex: 1,
    height: '100%',
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
    // marginRight: 1,
    position: 'relative',
    padding: 10,
    paddingRight: 5,
    justifyContent: 'space-around',
  },
  buttonGroup: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  terminate: {
    position: 'absolute',
    bottom: 15,
    right: 7,
    zIndex: 10,
  },
  modelName: {
    color: primaryColor,
    fontSize: 25,
    fontFamily: secondaryFont.bold,
  },
  renterName: {
    fontFamily: secondaryFont.regular,
    color: primaryColor,
    fontSize: 22,
  },
  cost: {
    color: primaryColor,
    fontFamily: secondaryFont.regular,
    fontSize: 18,
  },
  date: {
    color: primaryColor,
    fontFamily: secondaryFont.regular,
    fontSize: 14,
  },
  status: {
    height: 15,
    aspectRatio: 1 / 1,
    borderRadius: 10,
  },
})
