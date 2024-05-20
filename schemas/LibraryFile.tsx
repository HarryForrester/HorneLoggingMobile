import Realm from 'realm'

class LibraryFile extends Realm.Object<LibraryFile> {
  _id!: Realm.BSON.ObjectId
  _account!: number
  fileName!: string
  owner!: number
  type!: string
  uri!: string

  static schema = {
    name: 'libraryfile',
    properties: {
      _id: 'objectId',
      _account: 'int',
      fileName: 'string',
      owner: 'int',
      type: 'string',
      uri: 'string',
    },
    primaryKey: '_id',
  }
}

export default LibraryFile
