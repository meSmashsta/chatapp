import { User } from '@/interfaces/user'
import { v4 as uuidv4 } from 'uuid'

export class UserService {
  private pouchdb: PouchDB.Database

  constructor (pouchdb: PouchDB.Database) {
    this.pouchdb = pouchdb

    this.pouchdb.createIndex({
      index: {
        fields: ['username', 'password', 'type']
      }
    })

    this.pouchdb.createIndex({
      index: {
        fields: ['username', 'type']
      }
    })
  }

  async create (user: User): Promise<User> {
    user._id = uuidv4()
    user.dateCreated = new Date().toISOString()
    user.type = 'user'
    return (await this.pouchdb.put(user)) as unknown as User
  }

  async login (username: string, password: string): Promise<User> {
    const result = await this.pouchdb.find({
      selector: {
        username: { $eq: username },
        password: { $eq: password },
        type: { $eq: 'user' }
      }
    }) as unknown as { docs: User[] }
    if (result.docs.length > 0) {
      return result.docs[0]
    } else {
      throw new Error('User not found')
    }
  }

  async getUsers (): Promise<User[]> {
    const { username } = this.getLoggedInUser()
    const result = await this.pouchdb.find({
      selector: {
        username: { $nin: [username] },
        type: { $eq: 'user' }
      }
    }) as unknown as { docs: User[] }
    return result.docs
  }

  getLoggedInUser (): User {
    return JSON.parse(localStorage.getItem('user') as string) as unknown as User
  }
}
