import IMailTemplateProvider from '../models/IMailTemplateProvider'

class FakeMailTemplateProvider implements IMailTemplateProvider {
  public async parse(): Promise<string>{
    return 'Mail Content'
  }
}

export default FakeMailTemplateProvider


// Por ser fake não ha necessidade de uso das variaveis do DTO
