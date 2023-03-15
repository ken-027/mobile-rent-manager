/** @format */

import { StyleSheet, Text, View, Modal, Image } from 'react-native'
import { primaryColor, secondaryFont } from '../../config/variableStyle'

const Loading: React.FC<any> = ({}) => {
  return (
    <Modal
      transparent
      style={{ backgroundColor: primaryColor }}
      statusBarTranslucent
      animationType='fade'
      presentationStyle='overFullScreen'
      visible>
      <View style={styles.container}>
        <Image
          style={{
            height: 60,
          }}
          resizeMode='contain'
          source={require('../../assets/loading.gif')}
        />
        <Text style={styles.label}>Loading...</Text>
      </View>
    </Modal>
  )
}

export default Loading

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 20,
    fontFamily: secondaryFont.regular,
    marginTop: 10,
    color: primaryColor,
  },
})
