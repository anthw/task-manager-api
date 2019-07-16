import jwt from 'jsonwebtoken'
import User from '../models/user'
import { Request, Response, NextFunction } from 'express'

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // We only want the token, strip the rest.
    const token = req.header('Authorization').replace('Bearer ', '')
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as { _id: string }
    const user = await User.findOne({ _id: decodedToken._id, 'tokens.token': token })

    if (!user) {
      throw new Error()
    }

    // Add the user and token to the req so that it is available in routes using this middleware
    req.token = token
    req.user = user

    next()
  }
  catch (error) {
    res.status(401).send({ error: 'Not authenticated'})
  }
}

export default auth