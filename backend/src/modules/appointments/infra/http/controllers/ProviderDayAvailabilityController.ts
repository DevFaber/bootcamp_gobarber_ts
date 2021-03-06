import { Request, Response } from 'express'
import { container } from 'tsyringe'

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService'

export default class ProviderDayAvailabilityController {

  public async index(request : Request, response: Response ): Promise<Response> {
    const { provider_id } = request.params
    const { day, month, year} = request.query

      const listDayAvailability = container.resolve(ListProviderDayAvailabilityService)

      const dayAvailability = await listDayAvailability.execute({
        provider_id,
        day: Number(day),
        month: Number(month),
        year: Number(year),

      })

    return response.json(dayAvailability)

  }

}

// QUERY PARAMS ARE RECEIVED AS STRING, SO IT NEEDED TO CONVERT DATA BEFORE
