import { container } from 'tsyringe'

import IStorageProvider from '../providers/StorageProvider/models/IStorageProvider'
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider'

import IMailProvider from './MailProvider/models/IMailProvider'
import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider'

import IMailTemplateProvider from './MailTempateProvider/models/IMailTemplateProvider'
import HandlebarsMailTemplateProvider from './MailTempateProvider/implamentations/HandlebarsMailTemplateProvider'

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
)

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandlebarsMailTemplateProvider,
  )

  container.registerInstance<IMailProvider>(
    'MailProvider',
    container.resolve(EtherealMailProvider),
  )
