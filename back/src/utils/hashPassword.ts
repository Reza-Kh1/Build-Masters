import bcrypt from 'bcryptjs';
import { customError } from '../middlewares/globalError';

export async function createHash(password: string): Promise<string> {
  return bcrypt.hashSync(password, 10);
}

export async function comaprePassword(
  pass: string,
  prevPass: string
): Promise<boolean> {
  try {
    const checkPass = await bcrypt.compare(pass, prevPass);
    if (!checkPass) throw customError('پسورد وارد شده اشتباه است', 403);
    return checkPass;
  } catch (err) {
    throw customError('پسورد وارد شده اشتباه است', 403, err);
  }
}
