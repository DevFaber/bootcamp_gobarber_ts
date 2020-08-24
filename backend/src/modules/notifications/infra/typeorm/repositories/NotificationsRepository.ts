import { getMongoRepository, MongoRepository } from 'typeorm'

import INotificationsRepository from '../../../repositories/INotificationsRepository'
import ICreateNotificationDTO from '../../../dtos/ICreateNotificationDTO'

import Notification from '@modules/notifications/infra/typeorm/schemas/Notification'

class NotificationsRepository implements INotificationsRepository {
  private ormRepository: MongoRepository<Notification>

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo')
  }

  public async create({ content, recipient_id }: ICreateNotificationDTO): Promise<Notification> {
    const notification = this.ormRepository.create({ content, recipient_id })

    await this.ormRepository.save(notification)

    return notification
  }
}

export default NotificationsRepository



//************************************************************************** */
//  THERE ARE DIFFERENT METHODS FOR NO SQL DATABASES.
//  PAY ATTENTION FOR THE MONGO ONES

//  CHANGE getRepository ==> getMongoRepository
//  CHANGE Repository ==> MongoRepository
