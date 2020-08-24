import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { classToClass } from 'class-transformer'

import CreateLoginService from '@modules/users/services/CreateLoginService'


export default class SessionController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body

    const createLoginService = container.resolve(CreateLoginService)

    const { user, token } = await createLoginService.execute({
      email,
      password,
    })

    return response.json({ user: classToClass(user), token })
  }
}
