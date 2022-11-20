import { body } from 'express-validator'

export const transactionValidation = {
  transfer: [
    body('to')
      .isString().withMessage('Necessário inserir o ID da conta para transferência'),
    body('value')
      .isNumeric().withMessage('Não é um valor válido')
      .isFloat({ min: 0.10 }).withMessage('Valor mínimo suportado é de R$ 0,10')
  ]
}
