/** @format */

import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native'
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
import Model from '../../../models'
import { device } from '../../../types'
import colors from '../../../shared/colors'
import addDevice from '../../../services/addDevice'

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
  const [selectedColor, setselectedColor] = useState<number>(0)

  const onAdd = async () => {
    const response = await addDevice({
      brand: selectedBrand,
      modelName: modelName,
      rentPerHour: rentPerHour,
      color: selectedColor,
    })

    return response
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
      contentHeight={selectedDevice ? 320 : 420}
      visible={visible}
      onCancel={onCancel}
      onConfirm={async () => {
        let response

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
          <View
            style={{
              paddingHorizontal: 20,
            }}>
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
          <View
            style={{
              paddingHorizontal: 20,
            }}>
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
          {!selectedDevice ? (
            <View>
              <Text style={{ ...styles.label, paddingHorizontal: 20 }}>
                Device Color
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10, paddingHorizontal: 20 }}>
                {colors.map((color) => (
                  <TouchableOpacity
                    key={color.id}
                    onPress={() => setselectedColor(color.id)}
                    style={{
                      ...styles.colorIndicator,
                      backgroundColor: color.value.toString(),
                    }}>
                    {selectedColor === color.id ? (
                      <Icon
                        name='ios-checkmark-circle'
                        size={20}
                        color={secondaryColor}
                      />
                    ) : null}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ) : null}
        </View>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <View style={{ flex: 1, flexBasis: '50%', paddingTop: 20 }}>
          <Text style={styles.labelSmall}>
            {selectedDevice ? 'Brand' : 'Select a brand'}
          </Text>
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
                      brand: item.id,
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
    fontSize: 20,
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
    paddingVertical: 20,
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
  colorIndicator: {
    height: 35,
    borderRadius: 35,
    aspectRatio: 1 / 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.2,
    borderColor: primaryColor,
  },
})
