/** @format */

import { StyleSheet, Text, View } from 'react-native'
import { useState } from 'react'
import type { PropsWithChildren } from 'react'
import { primaryColor, secondaryFont } from '../../../config/variableStyle'
import { ScrollView } from 'react-native'
import Card from '../../common/card'
import ResumableUserModal from './resumable-user-modal'
import Toast from 'react-native-toast-message'

type props = PropsWithChildren<{}>

type user = {
  name: string
  timeLeft: number
}

const users: user[] = [
  {
    name: 'User One',
    timeLeft: 21552,
  },
  {
    name: 'User Two',
    timeLeft: 1234,
  },
  {
    name: 'User Three',
    timeLeft: 342,
  },
  {
    name: 'User One',
    timeLeft: 100,
  },
]

const ResumableUsers: React.FC<props> = ({}) => {
  const [showModal, setshowModal] = useState<boolean>(false)
  const [selectedUser, setselectedUser] = useState<user>({
    name: '',
    timeLeft: 0,
  })

  const onResume = (selectUser: user) => {
    setselectedUser(selectUser)
    setshowModal(true)
  }

  return (
    <>
      <ResumableUserModal
        onConfirm={() => {
          setshowModal(false)
          Toast.show({
            type: 'success',
            text1: 'Rent Status',
            text2: `${selectedUser?.name} is resumed`,
          })
        }}
        onClose={() => {
          setshowModal(false)
        }}
        onCancel={() => {
          setshowModal(false)
        }}
        selectedUser={selectedUser}
        visible={showModal}
      />
      <View style={styles.cardContainer}>
        <Text style={styles.cardHeader}>Resumable Users</Text>
        <ScrollView
          // indicatorStyle='black'
          showsHorizontalScrollIndicator={false}
          // eslint-disable-next-line react-native/no-inline-styles
          contentContainerStyle={{ gap: 15, paddingHorizontal: 10 }}
          horizontal>
          {users.map((item, index) => (
            <Card
              key={index}
              onPress={() => onResume(item)}
              resumableUser={{ name: item.name, time: item.timeLeft }}
            />
          ))}
        </ScrollView>
      </View>
    </>
  )
}

export default ResumableUsers

const styles = StyleSheet.create({
  cardContainer: {
    maxHeight: 120,
    marginBottom: 5,
  },
  cardHeader: {
    fontSize: 20,
    paddingHorizontal: 10,
    color: primaryColor,
    marginBottom: 5,
    fontFamily: secondaryFont.bold,
    marginLeft: 10,
  },
})
