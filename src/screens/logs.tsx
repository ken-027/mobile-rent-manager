/** @format */

import { PropsWithChildren, useEffect, useState } from 'react'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import Screen from '../components/layout/screen'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  SectionList,
  Image,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import {
  primaryColor,
  secondaryColor,
  secondaryFont,
} from '../config/variableStyle'
import {
  dateAddDay,
  dateEqual,
  dateSubDay,
  endTime,
  startHour,
  startTime,
  toDateFormat,
  toDateTimeFormat,
  toHour,
  toTimeFormat,
} from '../utils/format'
import Model, { logsSchema } from '../models'
import { log } from '../types'
import { useIsFocused } from '@react-navigation/native'
import brands from '../shared/brands'

type props = PropsWithChildren<{
  navigation: NativeStackNavigationProp<any>
}>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Logs: React.FC<props> = ({ navigation }) => {
  const isFocus = useIsFocused()
  const [filterDate, setfilterDate] = useState<Date>(new Date())
  const [logs, setLogs] = useState<{ title: string; data: log[] }[]>([])
  const [isVisible, setisVisible] = useState<boolean>(false)
  const [isRefresh, setisRefresh] = useState<boolean>(false)

  useEffect(() => {
    getLogs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocus, isRefresh])

  const onShow = () => {
    setisVisible(true)
  }

  const onConfirm = (date: Date) => {
    setfilterDate(date)
    setisVisible(false)
    onRefresh()
  }

  const onCancel = () => {
    setisVisible(false)
  }

  const onNext = () => {
    if (startTime(filterDate) < startTime(new Date())) {
      setfilterDate(dateAddDay(filterDate))
      onRefresh()
    }
  }

  const onRefresh = () => setisRefresh((prevState) => !prevState)

  const onReset = () => {
    setfilterDate(new Date())
    onRefresh()
  }

  const onBack = () => {
    setfilterDate(dateSubDay(filterDate))
    onRefresh()
  }

  const getLogs = async () => {
    try {
      const conn = await Model.connection()
      const logModel = await conn?.objects<log>(logsSchema.name)

      if (logModel) {
        const logFiltered = await logModel.filtered(
          'dateAdded >= $0 && dateAdded < $1',
          startTime(filterDate),
          endTime(filterDate),
        )

        const hours = [
          ...new Set(
            logFiltered.map((item) => toTimeFormat(startHour(item.dateAdded))),
          ),
        ]

        const customLog = hours.map((hour) => ({
          title: hour,
          data: logFiltered.filter(
            (item) => hour === toTimeFormat(startHour(item.dateAdded)),
          ),
        }))
        setLogs(customLog)
        // Model.close()
      }
    } catch (error: any) {
      console.error('Realm', error.message)
    }
  }

  return (
    <Screen title='Records'>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.cardHeader}>Rent Records</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 3,
            }}>
            {!dateEqual(new Date(), filterDate) ? (
              <TouchableOpacity onPress={onReset}>
                <Icon
                  name='ios-refresh-circle-outline'
                  size={30}
                  color={primaryColor}
                />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity onPress={onShow}>
              <Icon
                name='ios-calendar'
                size={30}
                color={primaryColor}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.button}
            onPress={onBack}>
            <Icon
              name='ios-chevron-back'
              size={25}
              color={secondaryColor}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              textAlign: 'center',
              fontFamily: secondaryFont.bold,
              color: primaryColor,
            }}>
            {toDateFormat(filterDate)}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={onNext}>
            <Icon
              name='ios-chevron-forward'
              size={25}
              color={secondaryColor}
            />
          </TouchableOpacity>
        </View>
        <DateTimePickerModal
          date={filterDate}
          isVisible={isVisible}
          mode='date'
          onConfirm={onConfirm}
          onCancel={onCancel}
          display='spinner'
          textColor={primaryColor}
          maximumDate={new Date()}
          minimumDate={new Date('2000')}
          style={{
            backgroundColor: '#FFF',
            borderRadius: 5,
            padding: 10,
            height: 250,
          }}
        />
        {logs.length ? (
          <SectionList
            stickySectionHeadersEnabled
            contentContainerStyle={{
              padding: 10,
            }}
            sections={logs}
            // debug
            // keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <View>
                  <Text
                    style={{
                      color: primaryColor,
                      fontSize: 20,
                      fontFamily: secondaryFont.regular,
                    }}>
                    {item.rent.status}
                  </Text>
                  <Text
                    style={{
                      color: primaryColor,
                      fontSize: 20,
                      fontFamily: secondaryFont.regular,
                    }}>
                    {toDateTimeFormat(item.rent.dateAdded)}
                  </Text>
                  <Text
                    style={{
                      color: primaryColor,
                      fontSize: 20,
                      fontFamily: secondaryFont.regular,
                    }}>
                    {item.rent.device &&
                      brands[Number(item.rent.device.brand)].name}
                  </Text>
                  <Text
                    style={{
                      color: primaryColor,
                      fontSize: 20,
                      fontFamily: secondaryFont.regular,
                    }}>
                    {item.rent.user.name}
                  </Text>
                  <Text
                    style={{
                      color: primaryColor,
                      fontSize: 20,
                      fontFamily: secondaryFont.regular,
                    }}>
                    {toHour(item.rent.user.seconds)}
                  </Text>
                </View>
              )
            }}
            renderSectionHeader={({ section: { title } }) => (
              <Text
                style={{
                  fontFamily: secondaryFont.bold,
                  color: primaryColor,
                  backgroundColor: secondaryColor,
                  padding: 5,
                  textAlign: 'center',
                  fontSize: 16,
                  paddingBottom: 5,
                }}>
                {title}
              </Text>
            )}
          />
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              style={{
                width: '90%',
              }}
              resizeMode='contain'
              source={require('../assets/no-records.png')}
            />
            <Text
              style={{
                fontFamily: secondaryFont.regular,
                color: primaryColor,
                marginTop: 10,
                fontSize: 18,
              }}>
              No records
            </Text>
          </View>
        )}
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  cardHeader: {
    fontSize: 20,
    color: primaryColor,
    marginBottom: 5,
    fontFamily: secondaryFont.bold,
    // paddingHorizontal: 10,
  },
  button: {
    backgroundColor: primaryColor,
    borderRadius: 5,
    paddingHorizontal: 2,
  },
})

export default Logs
