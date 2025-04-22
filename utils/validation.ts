export const validateTel = (tel: string) => {
  const regex = /^\+?[1-9][0-9]{7,14}$/;

  return regex.test(tel);
}

export const validateEmail = (email: string) => {
  const regex = /^\S+@\S+\.\S+$/;

  return regex.test(email);
}