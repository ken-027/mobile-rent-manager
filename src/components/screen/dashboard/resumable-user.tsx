/** @format */

import { StyleSheet, Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { primaryColor, secondaryFont } from '../../../config/variableStyle'
import { ScrollView } from 'react-native'
import Card from '../../common/card'
import ResumableUserModal from './resumable-user-modal'
import Toast from 'react-native-toast-message'
import { rent, user } from '../../../types'
import Model, { rentsSchema } from '../../../models'
import Icon from 'react-native-vector-icons/Ionicons'

type props = PropsWithChildren<{}>

const ResumableUsers: React.FC<props> = ({}) => {
  const [showModal, setshowModal] = useState<boolean>(false)
  const [isRefresh, setisRefresh] = useState<boolean>(false)
  const [users, setUsers] = useState<user[]>([])
  const [selectedUser, setselectedUser] = useState<user>({
    coins: 0,
    id: '',
    name: '',
    seconds: 0,
  })

  useEffect(() => {
    getAccounts()
  }, [isRefresh])

  const onRefresh = () => setisRefresh((prevState) => !prevState)

  const onResume = (selectUser: user) => {
    setselectedUser(selectUser)
    setshowModal(true)
  }

  const getAccounts = async () => {
    try {
      const conn = await Model.connection()

      const getUsers: any = await conn
        ?.objects(rentsSchema.name)
        .filtered(`user.seconds > 0 && status == 'removed'`)

      console.log(getUsers)

      setUsers(
        getUsers.map((item: rent) => ({
          id: item.user.id,
          coins: item.user.coins,
          seconds: item.user.seconds,
          name: item.user.name,
        })),
      )
      console.log(users)
      // conn?.close()
    } catch (error: any) {
      console.error(error.message)
    }
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
        <Text style={styles.cardHeader}>Resumable Accounts</Text>
        <ScrollView
          // indicatorStyle='black'
          showsHorizontalScrollIndicator={false}
          // eslint-disable-next-line react-native/no-inline-styles
          contentContainerStyle={{
            gap: 5,
            paddingHorizontal: 10,
            width: users.length ? 'auto' : '100%',
            justifyContent: users.length ? 'flex-start' : 'center',
          }}
          horizontal>
          {users.length ? (
            users.map((item) => (
              <Card
                key={item.id}
                onPress={() => onResume(item)}
                resumableUser={item}
              />
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <Icon
                name='ios-people-outline'
                size={50}
                color={primaryColor}
                // eslint-disable-next-line react-native/no-inline-styles
                style={{ opacity: 0.8 }}
              />
              <Text style={styles.noData}>No resumable accounts</Text>
            </View>
          )}
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
  noDataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    paddingTop: 5,
  },
  noData: {
    fontFamily: secondaryFont.regular,
    color: primaryColor,
    fontSize: 16,
    marginTop: 5,
  },
})
