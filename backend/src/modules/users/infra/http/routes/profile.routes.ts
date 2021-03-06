import { Router } from 'express'
import { container } from 'tsyringe'
import { celebrate, Segments, Joi } from 'celebrate'


import ProfileController from '../controllers/ProfileController'

import authMiddleware from '@modules/users/infra/http/middlewares/auth'

const profileRouter = Router()
const profileController = new ProfileController()

profileRouter.use(authMiddleware)

profileRouter.put('/', celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    old_password: Joi.string(),
    password: Joi.string(),
    password_confirmation: Joi.string().valid(Joi.ref('password'))
  }
}), profileController.update)


export default profileRouter
