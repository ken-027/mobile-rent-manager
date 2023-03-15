/** @format */

import Model, { logsSchema } from '../models'
import { log } from '../types'

const rentLog = async (rentItem: log) => {
  try {
    console.log(rentItem)
    const conn = await Model.connection()
    conn?.write(() => {
      conn.create<log>(logsSchema.name, rentItem)
    })
  } catch (error: any) {
    console.error(error.message)
  }
}

export default rentLog
