import React, { useCallback, useRef, useState } from 'react'
import { FiLogIn, FiMail } from 'react-icons/fi'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import * as Yup from 'yup'
import { Link } from 'react-router-dom'

import api from '../../services/api'
import { useToast } from '../../hooks/toast'
import getValidationErrors from '../../utils/getValidationErrors'

import logo from '../../assets/barber_logo.svg'

import Input from '../../components/Input'
import Button from '../../components/Button'

import { Container, Content, AnimationContainer, Background } from './styles'

interface ForgotPasswordFormData {
  email: string
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false)

  const formRef = useRef<FormHandles>(null)

  const { addToast } = useToast()

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        setLoading(true)

        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('Email obrigatório!')
            .email('Email inválido!'),
        })

        await schema.validate(data, {
          abortEarly: false,
        })

        await api.post('/password/forgot', {
          email: data.email,
        })

        addToast({
          type: 'success',
          title: 'Email de recuperação de senha enviado',
          description:
            'Um email de recuperação de senha foi enviado para você, verifique sua caixa de entrada!',
        })
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)

          formRef.current?.setErrors(errors)
        }

        addToast({
          type: 'error',
          title: 'Falha de recuperação de senha',
          description:
            'Ocorreu um erro na tentativa recuperar sua senha, tente novamente',
        })
      } finally {
        setLoading(false)
      }
    },
    [addToast]
  )

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber" />

          <Form onSubmit={handleSubmit} ref={formRef}>
            <h1>Recuperar Senha</h1>

            <Input icon={FiMail} name="email" placeholder="E-mail" />

            <Button loading={loading} type="submit">
              Recuperar
            </Button>
          </Form>

          <Link to="/">
            <FiLogIn />
            Voltar ao Login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  )
}

export default ForgotPassword
