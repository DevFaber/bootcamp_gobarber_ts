import { ValidationError } from 'yup'

interface ValidErrors {
  [key: string]: string
}

export default function getValidationErrors(err: ValidationError): ValidErrors {
  const validationErrors: ValidErrors = {}

  err.inner.forEach((error) => {
    validationErrors[error.path] = error.message
  })

  return validationErrors
}
