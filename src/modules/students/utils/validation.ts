export const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
export const isValidMobile = (value: string) => /^\d{10}$/.test(value);
