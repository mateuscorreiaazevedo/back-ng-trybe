import jwt from 'jsonwebtoken'
import env from '../../config/env'

class JwtAdapter {
  private readonly secret: string = env.jwtSecret!

  encrypt (id: string): string {
    return jwt.sign({ id }, this.secret, {
      expiresIn: '1d'
    })
  }

  async decrypt (cipherText: string): Promise<jwt.JwtPayload> {
    return jwt.verify(cipherText, this.secret) as any
  }
}

export const jwtAdapter = new JwtAdapter()
