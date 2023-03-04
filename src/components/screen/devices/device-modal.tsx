/** @format */

import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { PropsWithChildren, useState } from 'react'
import AppModal from '../../common/app-modal'
import Icon from 'react-native-vector-icons/Ionicons'
import {
  borderColor,
  primaryColor,
  secondaryColor,
  secondaryFont,
} from '../../../config/variableStyle'
import Card from '../../common/card'
import brands, { brand } from '../../../shared/brands'
import deviceModel from '../../../models/deviceModel'

type props = PropsWithChildren<{
  selectedDevice?: device | null
  visible: boolean
  onConfirm: (response: 'success' | 'error') => void
  onClose: any
  onCancel: any
}>

type device = {
  model: string
  brand: brand
  pricePerHour: number
}

const DeviceModal: React.FC<props> = ({
  visible,
  onClose,
  onConfirm,
  onCancel,
  selectedDevice,
}) => {
  const [modelName, setmodelName] = useState<string>('')
  const [rentPerHour, setrentPerHour] = useState<number>(0)

  const onAdd = async () => {
    try {
      const conn = await deviceModel.connection()

      await conn?.write(() => {
        conn.create(deviceModel.schema.name, {
          brand: 1,
          model: modelName,
          pricePerHour: +rentPerHour,
        })
      })
      deviceModel.close()
      return true
    } catch (error: any) {
      console.log(error.message)
      return false
    }
  }

  const onUpdate = async () => {
    return false
  }

  return (
    <AppModal
      title={selectedDevice ? 'Update Price' : 'Add Device'}
      btnTextBottom={{
        confirm: selectedDevice ? 'Update Price' : 'Add',
        cancel: 'Discard',
      }}
      visible={visible}
      onCancel={onCancel}
      onConfirm={async () => {
        let response: boolean

        if (selectedDevice) {
          response = await onUpdate()
        } else {
          response = await onAdd()
        }
        onConfirm(response ? 'success' : 'error')
      }}
      onClose={onClose}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <View style={styles.group}>
          <View>
            <Text style={styles.label}>Device Model</Text>
            {selectedDevice ? (
              <Text style={styles.labelData}>{selectedDevice.model}</Text>
            ) : (
              <TextInput
                onChangeText={setmodelName}
                style={styles.input}
              />
            )}
          </View>
          <View>
            <Text style={styles.label}>Coins/Hour</Text>
            <TextInput
              onChangeText={(val) => setrentPerHour(Number(val))}
              keyboardType='numeric'
              defaultValue={(selectedDevice
                ? selectedDevice.pricePerHour
                : 0
              ).toString()}
              style={styles.input}
            />
          </View>
        </View>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <View style={{ flex: 1, flexBasis: '50%', paddingTop: 20 }}>
          <Text style={styles.labelSmall}>Select a brand</Text>
          {/* eslint-disable-next-line react-native/no-inline-styles */}
          <ScrollView contentContainerStyle={{ paddingTop: 10 }}>
            {selectedDevice ? (
              <Card
                availableDevice={{
                  model: '',
                  brand: '\t\t\t\t\t',
                  image: selectedDevice.brand.image,
                }}
              />
            ) : (
              brands.map((item, index) => (
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
                    onPress={() => console.log(item.id)}
                    availableDevice={{
                      model: '',
                      brand: '\t\t\t\t\t',
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

export default DeviceModal

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
  labelData: {
    color: primaryColor,
    paddingHorizontal: 10,
    fontSize: 16,
    padding: 5,
    fontFamily: secondaryFont.bold,
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
