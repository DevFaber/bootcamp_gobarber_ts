import IParseMailTemplateDTO from '@shared/container/providers/MailTempateProvider/dtos/IParseMailTemplateDTO'

interface IMailContact {
  name: string
  email: string
}

export default interface ISendMailDTO {
  to: IMailContact
  from?: IMailContact
  subject: string
  templateData: IParseMailTemplateDTO
}
