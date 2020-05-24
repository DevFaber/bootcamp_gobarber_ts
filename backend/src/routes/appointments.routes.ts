import { Router } from 'express'
import { parseISO } from 'date-fns'
import { getCustomRepository } from 'typeorm'
import AppointmentsRepository from '../reppos/AppointmentsRepository'
import CreateAppointmentService from '../services/CreateAppointmentService'

import authMiddleware from '../middlewares/auth'

const appointmentsRouter = Router()

appointmentsRouter.use(authMiddleware)

appointmentsRouter.get('/', async (request, response) => {
  console.log(request.user)

  const appointmentsRepository = getCustomRepository(AppointmentsRepository)

  const appointments_list = await appointmentsRepository.find()

  console.log(appointments_list)

  return response.json(appointments_list)
})

appointmentsRouter.post('/', async (request, response) => {
  const { provider_id, date } = request.body

  const parsedDate = parseISO(date)

  const createAppointment = new CreateAppointmentService()
  const appointment = await createAppointment.execute({
    date: parsedDate,
    provider_id,
  })

  console.log(appointment)
  return response.json(appointment)
})

export default appointmentsRouter
