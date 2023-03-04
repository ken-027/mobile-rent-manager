/** @format */

import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { PropsWithChildren, useState } from 'react'
import AppModal from '../../common/app-modal'
import {
  borderColor,
  primaryColor,
  secondaryColor,
  secondaryFont,
} from '../../../config/variableStyle'
import Card from '../../common/card'
import { toHour } from '../../../utils/format'
import Icon from 'react-native-vector-icons/Ionicons'
import brands from '../../../shared/brands'

type props = PropsWithChildren<{
  selectedUser: {
    name: string
    timeLeft: number
  }
  selectedDevice?: {
    brand: string
    model: string
    image: string
  }
  visible: boolean
  onConfirm: any
  onClose: any
  onCancel: any
}>

type device = {
  model: string
  brand: string
  image: string
}

const devices: device[] = [
  {
    model: 'S-1324',
    brand: brands[0].name,
    image: brands[0].image,
  },
  {
    model: 'Y-256',
    brand: brands[1].name,
    image: brands[1].image,
  },
  {
    model: 'Note 8',
    brand: brands[2].name,
    image: brands[2].image,
  },
  {
    model: 'H S8',
    brand: brands[3].name,
    image: brands[3].image,
  },
]

const ResumableUserModal: React.FC<props> = ({
  selectedUser,
  selectedDevice,
  visible,
  onClose,
  onCancel,
  onConfirm,
}) => {
  const [addTime, setaddTime] = useState<number>(0)

  return (
    <AppModal
      title={selectedDevice ? 'Add Time' : 'Select Device'}
      visible={visible}
      onConfirm={onConfirm}
      btnTextBottom={{
        cancel: 'Cancel',
        confirm: 'Resume',
      }}
      onCancel={onCancel}
      onClose={onClose}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.group}>
          <View>
            <Text style={styles.label}>
              {selectedDevice ? 'Coins' : 'Add Coins'}
            </Text>
            <TextInput
              inputMode='numeric'
              keyboardType='numeric'
              defaultValue={`${addTime}`}
              onChangeText={(text) => setaddTime(text as unknown as number)}
              style={styles.input}
            />
          </View>
          <View>
            <Text style={styles.timeLeft}>
              {toHour(selectedUser?.timeLeft + +addTime)}
              <Text style={styles.hours}> hour(s)</Text>
            </Text>
            <Text
              numberOfLines={2}
              ellipsizeMode='tail'
              style={styles.selectedUser}>
              {selectedUser?.name}
            </Text>
          </View>
        </View>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <View style={{ flex: 1, flexBasis: '50%', paddingTop: 20 }}>
          <Text style={styles.labelSmall}>
            {selectedDevice ? 'Device that is using' : 'Select a Device'}
          </Text>
          {/* eslint-disable-next-line react-native/no-inline-styles */}
          <ScrollView contentContainerStyle={{ paddingTop: 10 }}>
            {selectedDevice ? (
              <Card
                availableDevice={{
                  model: selectedDevice?.model,
                  brand: selectedDevice?.brand,
                  image: selectedDevice?.image,
                }}
              />
            ) : (
              devices.map((item, index) => (
                <View
                  key={index}
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{ position: 'relative' }}>
                  <Icon
                    style={styles.check}
                    name='ios-checkmark-circle'
                    size={30}
                    color={secondaryColor}
                  />
                  <Card
                    onPress={() => console.log(2)}
                    availableDevice={{
                      model: item.model,
                      brand: item.brand,
                      image: item.image,
                    }}
                  />
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </AppModal>
  )
}

export default ResumableUserModal

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    flex: 1,
  },
  label: {
    color: primaryColor,
    fontFamily: secondaryFont.regular,
    paddingBottom: 10,
    fontSize: 18,
  },
  input: {
    borderColor: borderColor,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    padding: 5,
    borderWidth: 1,
    fontFamily: secondaryFont.regular,
  },
  labelSmall: {
    color: primaryColor,
    fontSize: 16,
    fontFamily: secondaryFont.regular,
    // marginBottom: 10,
  },
  group: {
    flexBasis: '50%',
    gap: 10,
    padding: 20,
    paddingRight: 0,
  },
  timeLeft: {
    fontSize: 35,
    color: primaryColor,
    fontFamily: secondaryFont.bold,
  },
  hours: {
    fontSize: 14,
    fontFamily: secondaryFont.regular,
  },
  selectedUser: {
    fontSize: 20,
    color: primaryColor,
    marginTop: 2,
    fontFamily: secondaryFont.regular,
  },
  check: {
    position: 'absolute',
    top: 2,
    left: 2,
    zIndex: 10,
  },
})
