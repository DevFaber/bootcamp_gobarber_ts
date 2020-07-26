import { Router } from 'express'

import authMiddleware from '@modules/users/infra/http/middlewares/auth'
import AppointmentsController from '../controllers/AppointmentsController'
import Appointment from '../../typeorm/entities/Appointment'

const appointmentsRouter = Router()
const appointmentsController = new AppointmentsController

appointmentsRouter.use(authMiddleware)

appointmentsRouter.post('/', appointmentsController.create)

export default appointmentsRouter
