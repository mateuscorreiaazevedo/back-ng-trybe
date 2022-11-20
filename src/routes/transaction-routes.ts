import { Router } from 'express'
import { transactionController } from '../http/controllers'
import { transactionValidation } from '../http/validations'
import { isAuth, validations } from '../middlewares'

export default (router: Router) => {
  /* 
  *  POST /transfer
  *  
  *  body
  *  {
  *    "to": "63766c6ef4280e93887cdf39",
  *    "value": 20
  *  }
  */
  router.post('/transfer', isAuth, transactionValidation.transfer, validations, transactionController.transfer)

  /* 
  *  GET /transactions
  *  
  *  body
  *  {
  *    "date": "2022-11-17",
  *    "type": "in"|"out"
  *  }
  */
  router.get('/transactions', isAuth, transactionController.index)
}