/* eslint-disable camelcase */
import React, { useCallback, useRef } from 'react'
import { FiLock } from 'react-icons/fi'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import * as Yup from 'yup'
import { useHistory, useLocation } from 'react-router-dom'
import getValidationErrors from '../../utils/getValidationErrors'
import { useToast } from '../../hooks/toast'

import api from '../../services/api'
import { Container, Content, AnimationContainer, Background } from './styles'
import logo from '../../assets/barber_logo.svg'

import Input from '../../components/Input'
import Button from '../../components/Button'

interface ResetPasswordFormData {
  password: string
  password_confirmation: string
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null)

  const history = useHistory()
  const { addToast } = useToast()
  const location = useLocation()

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          password: Yup.string()
            .required('Senha obrigatória')
            .min(6, 'Senha obrigatória!'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password')],
            'Senha não confere'
          ),
        })

        await schema.validate(data, {
          abortEarly: false,
        })

        const { password, password_confirmation } = data
        const token = location.search.replace('?token=', '')

        if (!token) {
          throw new Error()
        }

        await api.post('/password/reset', {
          password,
          password_confirmation,
          token,
        })

        addToast({
          type: 'success',
          title: 'Sucesso ao resetar senha',
          description:
            'Sua senha foi resetada com sucesso. Faça login na aplicação!',
        })

        history.push('/')
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)

          formRef.current?.setErrors(errors)
        }

        addToast({
          type: 'error',
          title: 'Falha ao resetar senha',
          description:
            'Ocorreu um erro na tentativa resetar sua senha, tente novamente',
        })
      }
    },
    [addToast, history, location.search]
  )

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber" />

          <Form onSubmit={handleSubmit} ref={formRef}>
            <h1>Recuperação de senha</h1>

            <Input
              icon={FiLock}
              name="password"
              type="password"
              placeholder="Senha"
            />
            <Input
              icon={FiLock}
              name="password_confirmation"
              type="password"
              placeholder="Confirmação de senha"
            />

            <Button type="submit">Alterar</Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  )
}

export default ResetPassword
