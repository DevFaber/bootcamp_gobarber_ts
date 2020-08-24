import { ObjectID } from 'typeorm'

import INotificationsRepository from '../../repositories/INotificationsRepository'
import ICreateNotificationDTO from '../../dtos/ICreateNotificationDTO'

import Notification from '@modules/notifications/infra/typeorm/schemas/Notification'

class FakeNotificationsRepository implements INotificationsRepository {
  private notifications: Notification[] = []

  public async create({ content, recipient_id }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification

    Object.assign(notification, { id: new ObjectID(), content, recipient_id })

    this.notifications.push(notification)

    return notification
  }
}

export default FakeNotificationsRepository



//************************************************************************** */
//  THERE ARE DIFFERENT METHODS FOR NO SQL DATABASES.
//  PAY ATTENTION FOR THE MONGO ONES

//  CHANGE UUID METHOD FOR GENERATE ID ==> new ObjectID
