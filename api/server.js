// BUILD YOUR SERVER HERE

const express = require('express')
const Users = require('./users/model')

const server = express()

server.use(express.json())

// [GET] /
server.get('/', (req, res) => {
    res.json({ message: 'append URL with /api/users to view data' })
})

// [GET] /api/users - Returns an array
server.get('/api/users', async (req, res) => {
    try {
      const users = await Users.find()
      res.status(200).json(users)
    } catch (error) {
      console.log(error.message) 
      res.status(500).json({ message: `You have encountered an ERROR: ${error.message}` })
    }
})

// [GET] /api/users/:id - Returns the user object with the specified `id`.
server.get('/api/users/:id', async (req, res) => {
    try {
      const { id } = req.params
      const user = await Users.findById(id)
      if (!user) {
        res.status(404).json({ message: "The user with the specified ID does not exist" })
      } else {
        res.status(200).json(user)
      }
    } catch (error) {
      res.status(500).json({ message: `You have encountered an ERROR: ${error.message}` })
    }
})

// [POST] /api/users - Creates a user using the information sent inside the `request body`.
server.post('/api/users', async (req, res) => {
    try {
      const { name, bio } = req.body
      if (!name || !bio) {
        res.status(400).json({ message: "Please provide name and bio for the user" })
      } else {
        const user = await Users.insert({ name, bio })
        res.status(201).json(user)
      }
    } catch (err) {
      res.status(500).json({ message: "There was an error while saving the user to the database", err: err.message })
    }
})

// [PUT] /api/users/:id - Updates the user with the specified `id` using data from the `request body`. Returns the modified user
server.put('/api/users/:id', async (req, res) => {
    try {
      const { id } = req.params
      const { name, bio } = req.body
      const user = await Users.findById(id)
      if (!user) {
        res.status(404).json({ message: "The user with the specified ID does not exist" })
      } else {
            if (!name || !bio) {
                res.status(400).json({ message: "Please provide name and bio for the user" })
            
            } else {
                const updatedUser = await Users.update(id, { name, bio })
                res.status(200).json(updatedUser)
            }
        }
    } catch (err) {
      res.status(500).json({ message: "The user information could not be modified", err: err.message })
    }
})

// [DELETE] /api/users/:id - Removes the user with the specified `id` and returns the deleted user.
// server.remove('/api/users/:id', (req, res) => {
//     const { id } = req.params
//     Users.remove(id)
//       .then(deletedUser => {
//         if (!deletedUser) {
//           res.status(404).json({ message: "The user with the specified ID does not exist" })
//         } else {
//           res.status(200).json(deletedUser)
//         }
//       })
//       .catch(err => {
//         res.status(500).json({ message: "The user could not be removed", err: err.message })
//       })
// })

server.use('*', (req, res) => {
    res.status(404).json({message: 'not found'})
})
module.exports = server 
// EXPORT YOUR SERVER instead of {}
