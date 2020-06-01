import { Router } from 'express'
import multer from 'multer'
// import { getCustomRepository } from 'typeorm'
import uploadConfig from '../config/upload'
import CreateUserService from '../services/CreateUserService'
import UpdateUserAvatarService from '../services/UpdateUserAvatarService'
// import UserRepository from '../reppos/UserRepository'

import authMiddleware from '../middlewares/auth'

const userRouter = Router()
const upload = multer(uploadConfig)

// userRouter.get('/', async (request, response) => {
//   const userRepository = getCustomRepository(UserRepository)
// })

userRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body

  const createUser = new CreateUserService()

  const user = await createUser.execute({
    name,
    email,
    password,
  })

  delete user.password

  return response.json(user)
})

userRouter.put('/', async (request, response) => {})

userRouter.patch(
  '/avatar',
  authMiddleware,
  upload.single('avatar'),
  async (request, response) => {
    const updateUserAvatar = new UpdateUserAvatarService()

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    })

    delete user.password

    return response.json(user)
  },
)

userRouter.delete('/', async (request, response) => {})

export default userRouter
