/** @format */
import Realm from 'realm'

class deviceModel {
  static schema = {
    name: 'Devices',
    properties: {
      id: {
        type: 'objectId',
        default: () => new Realm.BSON.ObjectId(),
      },
      brand: 'int',
      model: 'string',
      pricePerHour: {
        type: 'double',
        default: 5,
      },
      date_added: {
        type: 'date',
        default: () => new Date(),
      },
      deleted: 'bool?',
    },
    primaryKey: 'id',
  }

  static connection = async () => {
    try {
      const conn = await Realm.open({
        // path: 'realm-files/myrealm',
        schema: [deviceModel.schema],
        encryptionKey: new Int8Array(64),
      })
      return conn
    } catch (error: any) {
      console.log(error.message)
    }
  }

  // static create = async (
  //   brand: number,
  //   model: string,
  //   pricePerHour: number,
  // ) => {
  //   ;(await deviceModel.connection).write(async () => {
  //     const added = (await deviceModel.connection).create(
  //       deviceModel.schema.name,
  //       {
  //         brand: brand,
  //         model: model,
  //         pricePerHour: pricePerHour,
  //       },
  //     )
  //     console.log(await added)
  //   })
  // }

  // static all = async () => {
  //   const conn = await deviceModel.connection()
  //   const list = conn?.objects('Devices')
  //   deviceModel.close()
  //   return list
  // }

  static close = async () => {
    const conn = await deviceModel.connection()
    conn?.close()
  }
}

export default deviceModel
