/** @format */
import Realm from 'realm'
import RNFS from 'react-native-fs'
import { storagePermission } from '../utils/permissions'
const { UUID } = Realm.BSON

export const deviceSchema: Realm.ObjectSchema = {
  name: 'Devices',
  properties: {
    id: {
      type: 'uuid',
      default: () => new UUID(),
    },
    brand: 'int',
    model: 'string',
    pricePerHour: {
      type: 'double',
      default: 5,
    },
    dateAdded: {
      type: 'date',
      default: new Date(),
    },
    deleted: 'date?',
    available: {
      type: 'bool',
      default: true,
    },
  },
  primaryKey: 'id',
}

export const rentsSchema: Realm.ObjectSchema = {
  name: 'Rents',
  properties: {
    id: {
      type: 'uuid',
      default: () => new UUID(),
    },
    device: 'Devices?',
    dateAdded: {
      type: 'date',
      default: new Date(),
    },
    user: 'Users',
    status: 'string',
  },
  primaryKey: 'id',
}

export const usersSchema: Realm.ObjectSchema = {
  name: 'Users',
  properties: {
    id: {
      type: 'uuid',
      default: () => new UUID(),
    },
    name: 'string',
    seconds: 'int',
    coins: 'double',
  },
  primaryKey: 'id',
}

export const logsSchema: Realm.ObjectSchema = {
  name: 'Logs',
  properties: {
    id: {
      type: 'uuid',
      default: () => new UUID(),
    },
    rent: 'Rents',
    dateAdded: {
      type: 'date',
      default: new Date(),
    },
  },
  primaryKey: 'id',
}

const externalDirPath = RNFS.ExternalStorageDirectoryPath
const realmPath = `${externalDirPath}/database.realm`

class Model {
  static connection = async () => {
    console.log('Path', externalDirPath)
    try {
      await storagePermission()
      const conn = await Realm.open({
        // path: 'realm-files/myrealm',
        // path: realmPath,
        schema: [deviceSchema, logsSchema, rentsSchema, usersSchema],
        schemaVersion: 2,
        encryptionKey: new Int8Array(64),
      })
      return conn
    } catch (error: any) {
      console.log(error.message)
    }
  }

  static close = async () => {
    const conn = await Model.connection()
    conn?.close()
  }
}

export default Model
