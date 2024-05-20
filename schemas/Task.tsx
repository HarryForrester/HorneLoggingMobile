import Realm, {ObjectSchema} from 'realm'

export class TaskNotes extends Realm.Object {
  body?: string
  date?: Date
  from?: string

  static schema: Realm.ObjectSchema = {
    name: 'TaskNotes',
    embedded: true,
    properties: {
      body: 'string?',
      date: 'date?',
      from: 'string?',
    },
  }
}

export class Task extends Realm.Object<Task> {
  _id!: Realm.BSON.ObjectId
  _account?: number
  body?: string
  date?: string
  from?: string
  notes!: Realm.List<TaskNotes>
  priority?: string
  subject?: string
  to!: Realm.List<string>

  static schema: ObjectSchema = {
    name: 'tasks',
    properties: {
      _id: 'objectId',
      _account: 'int?',
      body: 'string?',
      date: 'string?',
      from: 'string?',
      notes: 'TaskNotes[]',
      priority: 'string?',
      subject: 'string?',
      to: 'string[]',
    },
    primaryKey: '_id',
  }
}
