/** @format */

import { useEffect } from 'react'
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  ImageBackground,
  View,
} from 'react-native'
import type { PropsWithChildren } from 'react'
import {
  primaryColor,
  secondaryColor,
  secondaryFont,
} from '../../config/variableStyle'
import { toHour } from '../../utils/format'
import { device, user } from '../../types'
import brands from '../../shared/brands'
import colors from '../../shared/colors'

type props = PropsWithChildren<{
  onPress?: any
  availableDevice?: device
  brandOnly?: boolean
  resumableUser?: user
}>

const Card: React.FC<props> = ({
  availableDevice,
  resumableUser,
  onPress,
  brandOnly,
}) => {
  useEffect(() => {}, [])

  return (
    <TouchableHighlight
      activeOpacity={0.2}
      underlayColor={availableDevice ? primaryColor : secondaryColor}
      onPress={onPress}
      style={
        availableDevice
          ? {
              ...styles.card,
            }
          : { ...styles.card, ...styles.cardLight }
      }>
      <ImageBackground
        resizeMode='contain'
        style={styles.cardImage}
        // eslint-disable-next-line react-native/no-inline-styles
        imageStyle={{
          ...styles.imgStyle,
          opacity: resumableUser ? 0.08 : !brandOnly ? 0.3 : 1,
          // transform: [{ scale: resumableUser ? 3.3 : 1.5 }],
        }}
        source={
          resumableUser
            ? require('../../assets/user-dark.png')
            : brands[availableDevice?.brand as number].image
        }>
        {availableDevice?.color ? (
          <View
            style={{
              ...styles.colorIndicator,
              backgroundColor:
                colors[availableDevice.color as number].value.toString(),
            }}
          />
        ) : null}
        <Text
          numberOfLines={1}
          ellipsizeMode='tail'
          style={{
            ...styles.cardTitle,
            color: availableDevice ? secondaryColor : primaryColor,
          }}>
          {brandOnly
            ? '\t\t\t\t\t'
            : resumableUser?.name ||
              brands[availableDevice?.brand as number].name}
        </Text>
        <Text
          ellipsizeMode='tail'
          numberOfLines={1}
          style={{
            ...styles.cardText,
            color: availableDevice ? secondaryColor : primaryColor,
          }}>
          {brandOnly
            ? '\t\t\t\t\t'
            : availableDevice?.model || toHour(resumableUser?.seconds)}
        </Text>
      </ImageBackground>
    </TouchableHighlight>
  )
}

export default Card

const styles = StyleSheet.create({
  card: {
    backgroundColor: primaryColor,
    height: 80,
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 5,
    width: 130,
    justifyContent: 'center',
    borderColor: 'rgba(63, 63, 70, 0.3)',
    borderWidth: 0.5,
    alignItems: 'center',
    position: 'relative',
    marginBottom: 10,
    shadowColor: primaryColor,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginTop: 2,
    overflow: 'hidden',
    elevation: 3,
  },
  cardLight: {
    backgroundColor: secondaryColor,
  },
  cardText: {
    color: secondaryColor,
    fontFamily: secondaryFont.bold,
    includeFontPadding: false,
    fontSize: 23,
    // transform: [{ scale: 1.8 }],
    // maxWidth: '98%',
  },
  cardImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: secondaryFont.bold,
    textTransform: 'capitalize',
  },
  imgStyle: {
    opacity: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    alignSelf: 'center',
    resizeMode: 'contain',
    // height: 80,
    transform: [{ scale: 0.7 }],
    // margin: 5,
  },
  colorIndicator: {
    height: 20,
    borderRadius: 20,
    aspectRatio: 1 / 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.2,
    position: 'absolute',
    borderColor: secondaryColor,
    left: 5,
    top: 5,
  },
})
