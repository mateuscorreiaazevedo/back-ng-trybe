import { NextFunction, Request, Response } from "express"
import { jwtAdapter } from "../adapters"

export async function isAuth (req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers['authorization']
  const token = authorization && authorization.split(' ')[1]

  if (!token) {
    return res.status(401).json({ errors: ['Usuário não autorizado.'] })
  }

  try {
    await jwtAdapter.decrypt(token)
    next()
  } catch (err) {
    if (err &&
      (err as any).message === 'invalid signature' ||
      (err as any).message === 'invalid algorithm'
    ) {
      return res.status(498).json({ errors: ['Token inválido.'] })
    }

    return res.status(403).json({ errors: ['Acesso negado ao usuário.'] })
  }
}
