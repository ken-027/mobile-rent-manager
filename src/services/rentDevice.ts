/** @format */

import Model, { deviceSchema, rentsSchema } from '../models'
import { device, log, rent, user } from '../types'
import coinToSeconds from '../utils/coinToSeconds'
import makeUnavailable from './makeUnavailableDevice'
import rentLog from './rentLog'

type params = {
  userName: string
  deviceId: string
  pricePerHour: number
  coins: number
}

const rentDevice = async ({
  userName,
  deviceId,
  pricePerHour,
  coins,
}: params) => {
  let response: 'success' | 'fail' = 'fail'
  try {
    const model = await Model.connection()
    await model?.write(() => {
      const userModel = model
        .objects<user>('Users')
        .filtered('name == $0', userName)[0]
      const deviceModel = model.objectForPrimaryKey<device>(
        deviceSchema.name,
        deviceId,
      )

      const rentModel = model.create<rent>(rentsSchema.name, {
        device: deviceModel,
        user: userModel || {
          name: userName,
        },
        seconds: coinToSeconds(pricePerHour, coins),
        coins: coins,
        status: 'started',
      })

      const logRent: log = {
        dateAdded: new Date(),
        device: rentModel.device as device,
        user: rentModel.user,
        coins: rentModel.coins,
        seconds: rentModel.seconds,
        status: rentModel.status,
      }

      rentLog(logRent)

      makeUnavailable(deviceId)
    })
    // response = 'success'
  } catch (error: any) {
    console.error(error.message)
  }

  return response
}

export default rentDevice
