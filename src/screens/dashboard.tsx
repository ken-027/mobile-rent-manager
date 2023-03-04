/**
 *
 * @format
 */
import type { PropsWithChildren } from 'react'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

import RentedDevices from '../components/screen/dashboard/rented-devices'
import AvailableDevices from '../components/screen/dashboard/available-devices'
import ResumableUsers from '../components/screen/dashboard/resumable-user'
import Screen from '../components/layout/screen'

type props = PropsWithChildren<{
  navigation: NativeStackNavigationProp<any>
}>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Dashboard: React.FC<props> = ({ navigation }) => {
  return (
    <Screen title='Dashboard'>
      <AvailableDevices />
      <ResumableUsers />
      <RentedDevices />
    </Screen>
  )
}

export default Dashboard
