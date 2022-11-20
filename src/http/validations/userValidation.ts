import { body } from 'express-validator'

export const userValidation = {
  register: [
    body('name')
      .isString().withMessage('O nome é obrigatório')
      .isLength({ min: 3 }).withMessage('O nome de usuário deve conter no mínimo 3 caracteres'),
    body('email')
      .isString().withMessage('O email é obrigatório')
      .isEmail().withMessage('O email não é válido'),
    body('password')
      .isString().withMessage('A senha é obrigatória')
      .isStrongPassword({
        minLength: 8,
        minLowercase: 0,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
        returnScore: false,
        pointsPerUnique: 1,
        pointsPerRepeat: 0.5,
        pointsForContainingLower: 10,
        pointsForContainingUpper: 10,
        pointsForContainingNumber: 10,
        pointsForContainingSymbol: 10,
      }).withMessage('A senha deve ser composta por pelo menos 8 caracteres, um número e uma letra maiúscula')
  ],
  login: [
    body('email')
      .isString().withMessage('O email é obrigatório')
      .isEmail().withMessage('O email não é válido'),
    body('password')
      .isString().withMessage('A senha é obrigatória')
  ]
}
