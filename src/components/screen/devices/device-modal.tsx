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
import brands from '../../../shared/brands'
import Model, { deviceSchema } from '../../../models'
import { device } from '../../../types'

type props = PropsWithChildren<{
  selectedDevice?: device | null
  visible: boolean
  onConfirm: (response: 'success' | 'error') => void
  onClose: any
  onCancel: any
}>

const DeviceModal: React.FC<props> = ({
  visible,
  onClose,
  onConfirm,
  onCancel,
  selectedDevice,
}) => {
  const [modelName, setmodelName] = useState<string>('')
  const [rentPerHour, setrentPerHour] = useState<number>(5)
  const [selectedBrand, setselectedBrand] = useState<number>(0)

  const onAdd = async () => {
    try {
      const conn = await Model.connection()

      await conn?.write(() => {
        conn.create(deviceSchema.name, {
          brand: selectedBrand,
          model: modelName,
          pricePerHour: +rentPerHour,
        })
      })
      // deviceModel.close()
      return true
    } catch (error: any) {
      console.log(error.message)
      return false
    }
  }

  const onUpdate = async () => {
    try {
      const conn = await Model.connection()

      conn?.write(() => {
        const updateDevice: any = conn
          .objects('Devices')
          .filtered('id == $0', selectedDevice?.id)[0]

        updateDevice.pricePerHour = rentPerHour
      })
      return true
    } catch (error: any) {
      console.log(error.message)
      return false
    }
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
                placeholder='Code'
                onChangeText={setmodelName}
                style={styles.input}
              />
            )}
          </View>
          <View>
            <Text style={styles.label}>Coins/Hour</Text>
            <TextInput
              placeholder='Peso'
              onChangeText={(val) => setrentPerHour(Number(val))}
              keyboardType='numeric'
              defaultValue={(selectedDevice
                ? selectedDevice.pricePerHour
                : rentPerHour
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
                brandOnly
                availableDevice={selectedDevice}
              />
            ) : (
              brands.map((item) => (
                <View
                  key={item.id}
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    position: 'relative',
                    opacity: selectedBrand === item.id ? 1 : 0.9,
                  }}>
                  {selectedBrand === item.id ? (
                    <Icon
                      style={styles.check}
                      name='ios-checkmark-circle'
                      size={30}
                      color={secondaryColor}
                    />
                  ) : (
                    ''
                  )}
                  <Card
                    brandOnly
                    onPress={() => setselectedBrand(item.id)}
                    availableDevice={{
                      ...(selectedDevice as any),
                      brand: { ...item },
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
    paddingHorizontal: 15,
    fontSize: 20,
    paddingVertical: 10,
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
