import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO'

export default interface IMailTemplateProvider {
  parse(data: IParseMailTemplateDTO): Promise<string>
}


// Uso dos templates engines do node, por opção o Handlebars
