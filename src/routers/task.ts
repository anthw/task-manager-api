import express from 'express'
import Task from '../models/task'
import auth from '../middleware/auth'

const router = express.Router()

router.get('/tasks', auth, async (req, res) => {
  const { completed } = req.query
  const sort = {}

  if (req.query.sort) {
    const sortParts = req.query.sort.split(':')

    sort[sortParts[0]] = sortParts[1] === 'desc' ? -1 : 1
  }

  try {
    await req.user.populate({
      path: 'tasks',
      match: completed ? { completed: completed === 'true' } : {},
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      }
    }).execPopulate()

    res.send(req.user.tasks)
  }
  catch (error) {
    res.status(500).send()
  }
})

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    const task = await Task.findOne({ _id, owner: req.user._id })

    if (!task) {
      return res.status(404).send()
    }

    res.send(task)
  }
  catch (error) {
    res.status(500).send()
  }
})

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  })

  try {
    await task.save()

    res.status(201).send(task)
  }
  catch (error) {
    res.status(400).send(error)
  }
})

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidUpdate) {
    return res.status(400).send({ error: 'Invalid updates' })
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user.id })

    if (!task) {
      return res.status(404).send()
    }

    updates.forEach((update) => task[update] = req.body[update])

    await task.save()

    res.send(task)
  }
  catch (error) {
    res.status(400).send(error)
  }
})

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id })

    if (!task) {
      return  res.status(404).send()
    }

    res.send(task)
  }
  catch (error) {
    res.status(500).send()
  }
})

export default router