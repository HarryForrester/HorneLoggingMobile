import Realm from 'realm'

class File extends Realm.Object<File> {
  _id!: Realm.BSON.ObjectId
  _account!: number
  fileName!: string
  owner!: Realm.BSON.ObjectId
  type!: string
  uri!: string

  static schema = {
    name: 'file',
    properties: {
      _id: 'objectId',
      _account: 'int',
      fileName: 'string',
      owner: 'objectId',
      type: 'string',
      uri: 'string',
    },
    primaryKey: '_id',
  }
}

export default File
