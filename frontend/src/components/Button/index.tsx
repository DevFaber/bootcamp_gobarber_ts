import React, { ButtonHTMLAttributes } from 'react'

import { Container } from './styles'

// interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{}
// Quando não houver atributos a sobreescrever a tipagem fica vazia e a
// interface pode ser escrita na sintaxe abaixo:

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => (
  <Container {...rest} type="submit">
    {children}
  </Container>
)

export default Button
