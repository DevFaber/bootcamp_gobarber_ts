# Recuperação de senha

**Requisitos Funcionais**

- O usuário poderá recuperar sua senha informando seu email
- O jusuário receberá um email com as instruções de recuperação da senha
- O usuário poderá resetar sua senha

**Requisitos Não Funcionais**

- Utiliizar mailtrapio para testar envio de emails em ambiente de desenvolvimento
- Utulizar Amazon SES para envios de emails em ambiente de produção
- O envio de emails deve ocorrer em segundo plano (background jobs)


**Regras de Negócio**

- O link enviado por email para resetar a senha, deve expirar em 2 horas
- O usupario precisa confirmar a nova senha ao resetá-la

# Atualização do perfil

**RF**

- O Usuário poderá atualizar seu perfil

**RN**

- O Usuário não pode alterar seu email para um emil ja utilizado
- Para atualizar sua senha, o usupario deve informar a senha antiga
- Para atualizar a sua senha, o usuário confirma a nova senha

# Painel do prestador

**RF**

- O usuario deve visualizar seus agendamentos diarios
- O prestador dever receber uma notificação sempre que houver um novo agendamento
- O prestador poderá visualizar as notificações não lidas

**RNF**

- Os agendamentos do prestador no dia devem ser armazenados em cache
- As notificações do prestador devem ser armazenadas no Bco Mongo DB
- As notificações devem ser enviadas em tempo real utilizando Socket.io

**RN**

- A notificação deve ter um status de lida ou não lida para que o prestador possa controlar

# Agendamento de serviços

**RF**
provérbios - 16
- O usuário poderá listar todos os prestadores de serviços cadastrados
- O usuário poderá listar os dias de um mes com pelo menos um horário disponivel de um restador
- O usuário poderá listar horários disponiveis em um dia especifico de um prestador
- O usuário poderá realizar um novo agendameto com um prestador


**RNF**

- A listagem de prestadores deverá ser armazanada em cache


**RN**

- Cada agendamento deve durar 1h exatamente
- Os agendamentos devem estar disoponpveis entre as 8h as 18h (primeiro as 8h,ultimo as 17h)
- O usuário não pode agendar em um horário ocupado
- O usuário não pode agendar serviços consigo
