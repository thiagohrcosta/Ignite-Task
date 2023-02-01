import http from 'node:http'
import { Database } from './database.js'

import { routes } from './routes.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/users'),
    handler: (req, res) => {
      const { search } = req.query

      const users = database.select('users', {
        name: search,
        email: search
      })

      return res.end(JSON.stringify(users))
    }
  },
]