/** @format */

import { StyleSheet, TouchableOpacity, View } from 'react-native'
import type { PropsWithChildren } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { primaryColor, secondaryColor } from '../../config/variableStyle'

type props = PropsWithChildren<{}>

const Navigation: React.FC<props> = ({}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Icon
          name='ios-phone-portrait-outline'
          size={40}
          color={primaryColor}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <Icon
          name='ios-grid'
          size={60}
          color={primaryColor}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <Icon
          name='ios-reader-outline'
          size={40}
          color={primaryColor}
        />
      </TouchableOpacity>
    </View>
  )
}

export default Navigation

const styles = StyleSheet.create({
  container: {
    backgroundColor: secondaryColor,
    height: 70,
    marginTop: 'auto',
    borderColor: '#E1E1E1',
    overflow: 'visible',
    borderTopWidth: 1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    zIndex: 10,
  },
})
