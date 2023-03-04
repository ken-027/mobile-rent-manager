/** @format */

import type { PropsWithChildren } from 'react'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import Screen from '../components/layout/screen'

type props = PropsWithChildren<{
  navigation: NativeStackNavigationProp<any>
}>

const Logs: React.FC<props> = ({ navigation }) => {
  return <Screen title='Logs' />
}

export default Logs
