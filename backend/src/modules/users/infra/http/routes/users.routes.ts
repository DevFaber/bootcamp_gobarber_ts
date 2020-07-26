import { Router } from 'express'
import multer from 'multer'
import { container } from 'tsyringe'

import uploadConfig from '@config/upload'
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService'
import UsersController from '../controllers/UsersControllers'
import UserAvatarController from '../controllers/UserAvatarController'

import authMiddleware from '@modules/users/infra/http/middlewares/auth'

const userRouter = Router()
const upload = multer(uploadConfig)
const usersController = new UsersController()
const userAvatarController = new UserAvatarController()


userRouter.post('/', usersController.create)

userRouter.put('/', async (request, response) => {})

userRouter.patch(
  '/avatar',
  authMiddleware,
  upload.single('avatar'),
  userAvatarController.update,
)

userRouter.delete('/', async (request, response) => {})

export default userRouter
