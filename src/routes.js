import { Console } from 'node:console'
import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const tasks = database.select('task')

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if (!title) {
        return res.writeHead(400).end(
          JSON.stringify({ message: "title is required"})
        )
      }

      if (!description) {
        return res.writeHead(400).end(
          JSON.stringify({ message: "description is required"})
        )
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      console.log(task)

      database.insert('task', task)
      return res.writeHead(201).end()

    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    
    handler: (req, res) => {
      const { id } = req.params
    
      const [task] = database.select('task', { id })
    
      if (!task) {
        return res.writeHead(404).end()
      }

      const { title, description } = req.body

      database.update('task', id, {
        title,
        description,
        updated_at: new Date()
      })

      return res.writeHead(204).end()
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params
      
      const [task] = database.select('task', { id })
      
      if (!task) {
        return res.writeHead(404).end()
      }

      if (task.completed_at) {
        return res.writeHead(400).end(
          JSON.stringify({ message: "task already completed"})
        )
      }

      const completed_at = task.completed_at ? null : new Date()

      database.update('task', id, {
        completed_at: completed_at,
        updated_at: new Date(),
        ...task
      })

      return res.writeHead(204).end()
    }
  }
]
