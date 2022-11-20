import { Response } from "express"

export function apiErrorsHelper (res: Response, error: any) {  
  res
    .status(500)
    .json({ errors: ['Erro no servidor, por favor tente mais tarde.'] })
}
