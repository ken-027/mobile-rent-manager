/** @format */

import Model, { deviceSchema } from '../models'
import { device, returnData } from '../types'

const getDevice = async (available: boolean = false): Promise<returnData> => {
  try {
    let query = 'deleted == null'
    query += available ? ' && available == true' : ''

    const conn = await Model.connection()
    const list = await conn?.objects<device>(deviceSchema.name)
    // let list = await deviceModel.all()
    const data = list?.filtered(query).sorted('dateAdded', true)
    return { data: data, connection: conn }
  } catch (error: any) {
    console.error('Realm Get', error.message)
    return { data: [], connection: {} }
  }
}

export default getDevice
