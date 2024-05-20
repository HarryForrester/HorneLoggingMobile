import Realm from 'realm'

// Define your object model
export class Account extends Realm.Object<Account> {
  _id!: Realm.BSON.ObjectId
  _account!: number
  _name!: string
  email!: string
  pasword!: string

  static schema = {
    name: 'account',
    properties: {
      _id: 'objectId',
      _account: 'int',
      name: 'string',
      email: 'string',
      password: 'string',
    },
    primaryKey: '_id',
  }
}
