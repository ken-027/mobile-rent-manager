/** @format */

import Model, { deviceSchema } from '../models'

const makeUnavailable = async (deviceId: string) => {
  try {
    const conn = await Model.connection()
    conn?.write(() => {
      const updateDevice: any = conn.objectForPrimaryKey(
        deviceSchema.name,
        deviceId,
      )
      updateDevice.available = false
    })
  } catch (error: any) {
    console.log(error.message)
  }
}

export default makeUnavailable
