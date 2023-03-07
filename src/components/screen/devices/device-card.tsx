/** @format */

import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import {
  primaryColor,
  secondaryColor,
  secondaryFont,
  primaryFont,
  redColor,
} from '../../../config/variableStyle'
import type { PropsWithChildren } from 'react'
import { brand } from '../../../types'

type device = {
  model: string
  brand: brand
  pricePerHour: number
}

type props = PropsWithChildren<{
  device: device
  onDelete: any
  onEdit: any
}>

const DeviceCard: React.FC<props> = ({ device, onDelete, onEdit }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <ImageBackground
          style={styles.logoHolder}
          resizeMode='contain'
          imageStyle={styles.logo}
          source={device.brand.image as never}
        />
      </View>
      <View style={styles.detailContainer}>
        <View style={styles.detailHolder}>
          <Text style={styles.brandName}>{device.brand.name}</Text>
          <Text style={styles.modelName}>{device.model}</Text>
          <Text style={styles.pricePerHour}>
            Php {device.pricePerHour}/Hour
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={onDelete}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              paddingHorizontal: 7,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon
              name='ios-trash'
              size={25}
              color={redColor}
            />
          </TouchableOpacity>
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              borderColor: primaryColor,
              borderTopWidth: 1,
            }}
          />
          <TouchableOpacity
            onPress={onEdit}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              paddingHorizontal: 7,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon
              name='ios-pricetag'
              size={25}
              color={primaryColor}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default DeviceCard

const styles = StyleSheet.create({
  container: {
    backgroundColor: primaryColor,
    height: 110,
    borderRadius: 20,
    padding: 1,
    flexDirection: 'row',
    shadowColor: primaryColor,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    overflow: 'hidden',
    elevation: 3,
  },
  detailContainer: {
    backgroundColor: secondaryColor,
    flex: 1,
    borderTopEndRadius: 20,
    borderBottomEndRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailHolder: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 5,
  },
  logoContainer: {
    flexBasis: '30%',
    maxWidth: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoHolder: {
    // flex: 1,
    ...StyleSheet.absoluteFillObject,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    alignSelf: 'center',
    transform: [{ scale: 0.45 }],
  },
  brandName: {
    fontFamily: secondaryFont.bold,
    color: primaryColor,
    fontSize: 20,
  },
  modelName: {
    fontFamily: primaryFont.semi,
    color: primaryColor,
    fontSize: 28,
    includeFontPadding: false,
    marginBottom: -2,
    marginTop: -2,
  },
  pricePerHour: {
    fontFamily: secondaryFont.regular,
    color: primaryColor,
    fontSize: 16,
  },
  buttonContainer: {
    height: '100%',
    borderLeftColor: primaryColor,
    borderLeftWidth: 1,
    justifyContent: 'space-between',
    paddingVertical: 10,
    overflow: 'hidden',
  },
})
