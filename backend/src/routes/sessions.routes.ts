import { Router } from 'express'

import CreateLoginService from '../services/CreateLoginService'
const sessionRouter = Router()

sessionRouter.post('/', async (request, response) => {
  const { email, password } = request.body

  const createLoginService = new CreateLoginService()

  const { user, token } = await createLoginService.execute({
    email,
    password,
  })

  return response.json({ user, token })
})

export default sessionRouter
