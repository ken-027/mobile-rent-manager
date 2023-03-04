/** @format */

import { StyleSheet, Text, View } from 'react-native'
import type { PropsWithChildren } from 'react'

type props = PropsWithChildren<{
  title: string
}>

const header: React.FC<props> = ({}) => {
  return (
    <View style={styles.container}>
      <Text>header</Text>
    </View>
  )
}

export default header

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
