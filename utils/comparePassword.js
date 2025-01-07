import bcrypt from "bcryptjs"
const comparePassword = async (candidatePassword, userPassword) => {
  return await bcrypt.compare(candidatePassword, userPassword)
}
export default comparePassword
