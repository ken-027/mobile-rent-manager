/**
 *
 * @format
 */
import { PropsWithChildren, useEffect } from 'react'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

import RentedDevices from '../components/screen/dashboard/rented-devices'
import AvailableDevices from '../components/screen/dashboard/available-devices'
import ResumableUsers from '../components/screen/dashboard/resumable-user'
import Screen from '../components/layout/screen'
import { ScrollView } from 'react-native'

type props = PropsWithChildren<{
  navigation: NativeStackNavigationProp<any>
}>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Dashboard: React.FC<props> = ({ navigation }) => {
  useEffect(() => {}, [])

  return (
    <Screen title='Dashboard'>
      <ScrollView
        // indicatorStyle='black'
        showsVerticalScrollIndicator={false}
        // eslint-disable-next-line react-native/no-inline-styles
        contentContainerStyle={{
          gap: 5,
          paddingBottom: 15,
          paddingTop: 10,
          // paddingHorizontal: 10,
          // flex: 1,
        }}>
        <AvailableDevices />
        <ResumableUsers />
        {/* <RentedDevices /> */}
      </ScrollView>
    </Screen>
  )
}

export default Dashboard
