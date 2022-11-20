import { Request } from "express"
import { jwtAdapter } from "../../adapters"

export async function loadToken (req: Request): Promise<string> {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  const { id } = await jwtAdapter.decrypt(token!)
  return id
}
