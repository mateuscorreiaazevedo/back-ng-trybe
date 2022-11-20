import bcrypt from 'bcrypt'

class BcryptAdapter {
  private readonly salt: number = 12

  async hash (plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.salt)
  }

  async compare (plainText: string, plainTextEncrypted: string): Promise<boolean> {
    return await bcrypt.compare(plainText, plainTextEncrypted)
  }
}

export const bcryptAdapter = new BcryptAdapter()
