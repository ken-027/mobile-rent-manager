/** @format */

import Model, { deviceSchema } from '../models'
import { device } from '../types'

type params = {
  brand: number
  modelName: string
  rentPerHour: number
  color: number
}

const addDevice = async ({
  brand,
  modelName,
  rentPerHour,
  color,
}: params): Promise<device | boolean> => {
  try {
    const conn = await Model.connection()
    let deviceCreated: any

    await conn?.write(() => {
      deviceCreated = conn.create<device>(deviceSchema.name, {
        brand: brand,
        model: modelName,
        pricePerHour: rentPerHour,
        color: color,
      })
    })
    return deviceCreated
  } catch (error: any) {
    console.log('Realm Add', error.message)
    return false
  }
}

export default addDevice
