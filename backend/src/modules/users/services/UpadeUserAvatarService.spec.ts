import AppError from '../../../shared/errors/AppError'
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository'
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider'
import UpdateAvatarService from './UpdateUserAvatarService'

let fakeUserRepository: FakeUserRepository
let fakeStorageProvider: FakeStorageProvider
let updateUserAvatar: UpdateAvatarService

describe('UpdateUserAvatar', () => {
  beforeEach(()=> {
    fakeUserRepository = new FakeUserRepository()
    fakeStorageProvider = new FakeStorageProvider()
    updateUserAvatar = new UpdateAvatarService(fakeUserRepository, fakeStorageProvider)
  })

  it('Should be able to create a new user', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'jon@email.com',
      password: '123456'
    })

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatarTeste'
    })

     expect(user.avatar).toBe('avatarTeste')
    })


    it('Should not be able to update a non existing user avatar ', async () => {
      expect(updateUserAvatar.execute({
          user_id: 'non-existing-user',
          avatarFilename: 'avatarTeste'
        })).rejects.toBeInstanceOf(AppError)
      })


      it('Should delete previous avatar at updating a new', async () => {
        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile')


        const user = await fakeUserRepository.create({
          name: 'John Doe',
          email: 'jon@email.com',
          password: '123456'
        })

        await updateUserAvatar.execute({
          user_id: user.id,
          avatarFilename: 'avatarTeste'
        })

        await updateUserAvatar.execute({
          user_id: user.id,
          avatarFilename: 'avatarTeste2'
        })

        expect(deleteFile).toHaveBeenCalledWith('avatarTeste')
        expect(user.avatar).toBe('avatarTeste2')
        })

})
