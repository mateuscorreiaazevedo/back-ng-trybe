import { Router } from 'express'
import { userController } from '../http/controllers'
import { userValidation } from '../http/validations'
import { isAuth, validations } from '../middlewares'

export default (router: Router) => {
  /* 
  *  POST /register
  *  
  *  body
  *  {
  *    "name": "Mateus Azevedo",
  *    "email": "mateuscorreiaazevedo@gmail.com",
  *    "password": "135fae895K"
  *  }
  */
  router.post('/register', userValidation.register, validations, userController.register)

  /* 
  *  POST /login
  *  
  *  body
  *  {
  *    "email": "mateuscorreiaazevedo@gmail.com",
  *    "password": "135fae895K"
  *  }
  */
  router.post('/login', userValidation.login, validations, userController.login)

  router.get('/me', isAuth, userController.getCurrentUser)

  router.get('/contacts', isAuth, userController.index)
}