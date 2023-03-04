/** @format */

import notifee, { AndroidImportance } from '@notifee/react-native'

type channel = {
  id: any
  name: string
  priority: AndroidImportance
}

const notification = async (title: string, body: string, channel: channel) => {
  try {
    await notifee.requestPermission()

    const channelId = await notifee.createChannel({
      id: channel.id,
      name: channel.name,
      importance: channel.priority,
      sound: 'notification',
    })

    // Display a notification
    await notifee.displayNotification({
      title: title,
      body: body,
      android: {
        channelId,
        importance: channel.priority,
        // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: channel.id,
        },
        sound: 'notification.wav',
      },
    })
  } catch (error) {
    console.log(error)
  }
}

export default notification
