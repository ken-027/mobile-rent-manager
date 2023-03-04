/** @format */

import { useEffect } from 'react'
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  ImageBackground,
} from 'react-native'
import type { PropsWithChildren } from 'react'
import {
  primaryColor,
  primaryFont,
  secondaryColor,
  secondaryFont,
} from '../../config/variableStyle'
import { toHour } from '../../utils/format'

type props = PropsWithChildren<{
  onPress?: any
  availableDevice?: {
    brand: string
    model: string
    image: any
  }
  resumableUser?: {
    name: string
    time: number
  }
}>

const Card: React.FC<props> = ({ availableDevice, resumableUser, onPress }) => {
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
          opacity: resumableUser
            ? 0.08
            : availableDevice?.brand.trim().length
            ? 0.3
            : 1,
          // transform: [{ scale: resumableUser ? 3.3 : 1.5 }],
        }}
        source={
          resumableUser
            ? require('../../assets/user-dark.png')
            : availableDevice?.image
        }>
        <Text
          numberOfLines={1}
          ellipsizeMode='tail'
          style={{
            ...styles.cardTitle,
            color: availableDevice ? secondaryColor : primaryColor,
          }}>
          {resumableUser?.name || availableDevice?.brand}
        </Text>
        <Text
          ellipsizeMode='tail'
          numberOfLines={1}
          style={{
            ...styles.cardText,
            color: availableDevice ? secondaryColor : primaryColor,
          }}>
          {availableDevice?.model || toHour(resumableUser?.time)}
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
    padding: 20,
    width: 130,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
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
    fontFamily: primaryFont.semi,
    includeFontPadding: false,
    marginTop: 5,
    transform: [{ scale: 1.8 }],
    // maxWidth: '98%',
  },
  cardImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: secondaryFont.bold,
  },
  imgStyle: {
    opacity: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    alignSelf: 'center',
    transform: [{ scale: 1.5 }],
    // margin: 5,
  },
})
