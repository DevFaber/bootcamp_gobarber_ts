/* eslint-disable camelcase */
import React, { useCallback, useRef, ChangeEvent } from 'react'
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import * as Yup from 'yup'
import { useHistory, Link } from 'react-router-dom'

import { useAuth } from '../../hooks/auth'
import { useToast } from '../../hooks/toast'
import api from '../../services/api'
import getValidationErrors from '../../utils/getValidationErrors'
import { Container, Content, AvatarInput } from './styles'
import Input from '../../components/Input'
import Button from '../../components/Button'

interface SignUpFormData {
  name: string
  email: string
  password: string
  old_password: string
  password_confirmation: string
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const history = useHistory()
  const { user, updateUser } = useAuth()

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      formRef.current?.setErrors({})

      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório!'),
          email: Yup.string()
            .required('Email obrigatório!')
            .email('E-mail inválido!'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: (val) => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: (val) => !!val.length,
              then: Yup.string().required('Campo obrigatório'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password')], 'Senha não confere'),
        })

        await schema.validate(data, {
          abortEarly: false,
        })

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        }
        const response = await api.put('/profile', formData)

        updateUser(response.data)

        history.push('/dashboard')

        addToast({
          type: 'success',
          title: 'Cadastro atualizado!',
          description: 'Alterações foram salvas com sucesso',
        })
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)

          formRef.current?.setErrors(errors)
        }

        addToast({
          type: 'error',
          title: 'Falha ao atualizar seu usuário',
          description: 'Ocorreu um erro na tentativa de atualização',
        })
      }
    },
    [addToast, history]
  )

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData()

        data.append('avatar', e.target.files[0])

        api.patch('/users/avatar', data).then((response) => {
          updateUser(response.data)
          addToast({
            type: 'success',
            title: 'Avatar atualizado',
            description: 'Sua foto de perfil foi aualizada com sucesso!',
          })
        })
      }
    },
    [addToast, updateUser]
  )

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>

      <Content>
        <Form
          initialData={{
            name: user.name,
            email: user.email,
          }}
          ref={formRef}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />

            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>
          <h1>Meu perfil</h1>

          <Input icon={FiUser} name="name" placeholder="Seu nome" />
          <Input icon={FiMail} name="email" placeholder="E-mail" />
          <Input
            containerStyle={{ marginTop: 24 }}
            icon={FiLock}
            name="old_password"
            type="password"
            placeholder="Senha antiga"
          />
          <Input
            icon={FiLock}
            name="password"
            type="password"
            placeholder="Nova senha"
          />
          <Input
            icon={FiLock}
            name="password_confirmation"
            type="password"
            placeholder="Confirmação de senha"
          />

          <Button type="submit">Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  )
}

export default Profile
