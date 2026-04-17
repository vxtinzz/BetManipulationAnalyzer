export function validateUserCreate({ username, password, cpf }: any) {
  const userNameRegex = /^[a-zA-Z0-9]{3,30}$/
  const cpfRegex = /^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/

  if(typeof username !=="string" || username.trim().length === 0 || !userNameRegex.test(username)){
    throw new Error("Invalid username")
  }

   if(typeof cpf !=="string" || cpf.trim().length === 0 || !cpfRegex.test(cpf)){
     throw new Error("Invalid CPF")
  }

  if (!password || password.length < 6) {
    throw new Error("Password too short")
  }
}  

export function validateUserUpdate({ username, password, cpf }: any) {
  const userNameRegex = /^[a-zA-Z0-9]{3,30}$/
  const cpfRegex = /^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/

  if(username !== undefined){
    if(typeof username !=="string" || username.trim().length === 0 || !userNameRegex.test(username)){
      throw new Error("Invalid username")
    }
}

  if(cpf !== undefined){
    if(typeof cpf !=="string" || cpf.trim().length === 0 || !cpfRegex.test(cpf)){
      throw new Error("Invalid CPF")
    }
  }

  if(password !== undefined){
    if (!password || password.length < 6) {
      throw new Error("Invalid Password")
    }
  }
}

export function validateUserDelete({password}: any) {
    if (!password || password.length < 6) {
      throw new Error("Invalid password")
    }
}

export function validateUserLogin({ username, password}: any) {
  const userNameRegex = /^[a-zA-Z0-9]{3,30}$/

  if(typeof username !=="string" || username.trim().length === 0 || !userNameRegex.test(username)){
    throw new Error("Invalid username")
  }

  if (!password || password.length < 6) {
    throw new Error("Password too short")
  }
}  