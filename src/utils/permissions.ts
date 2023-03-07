/** @format */

import { PermissionsAndroid } from 'react-native'
import { Toast } from 'react-native-toast-message/lib/src/Toast'

export const storagePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message: 'App needs access to your storage',
      },
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Write External Storage permission granted')
      // Toast.show({
      //   type: 'success',
      //   text1: 'Storage Permission',
      //   text2: `Storage permission successfully granted`,
      // })
    } else {
      console.log('Write External Storage permission denied')
    }
  } catch (err) {
    console.warn(err)
  }
}
