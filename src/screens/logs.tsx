/** @format */

import { PropsWithChildren, useState } from 'react'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import Screen from '../components/layout/screen'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
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
  toDateFormat,
} from '../utils/format'
import { ScrollView } from 'react-native'

type props = PropsWithChildren<{
  navigation: NativeStackNavigationProp<any>
}>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Logs: React.FC<props> = ({ navigation }) => {
  const [filterDate, setfilterDate] = useState<Date>(new Date())
  const [isVisible, setisVisible] = useState<boolean>(false)

  const onShow = () => {
    setisVisible(true)
  }

  const onConfirm = (date: Date) => {
    setfilterDate(date)
    setisVisible(false)
  }

  const onCancel = () => {
    setisVisible(false)
  }

  const onNext = () => {
    setfilterDate(dateAddDay(filterDate))
  }

  const onReset = () => {
    setfilterDate(new Date())
  }

  const onBack = () => {
    setfilterDate(dateSubDay(filterDate))
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
            ) : (
              ''
            )}
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

        <ScrollView
          // indicatorStyle='black'
          showsVerticalScrollIndicator={false}
          // eslint-disable-next-line react-native/no-inline-styles
          contentContainerStyle={{
            gap: 5,
            paddingBottom: 15,
            paddingTop: 10,
            paddingHorizontal: 10,
          }}>
          <DateTimePickerModal
            date={filterDate}
            isVisible={isVisible}
            mode='date'
            onConfirm={onConfirm}
            onCancel={onCancel}
            display='spinner'
            textColor={primaryColor}
            style={{
              backgroundColor: '#FFF',
              borderRadius: 5,
              padding: 10,
              height: 250,
            }}
          />
        </ScrollView>
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
