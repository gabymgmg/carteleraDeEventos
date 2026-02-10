export const validatePassword = (
  password: string,
  confirm: string
): string | null => {
  if (password.length < 6) return 'Password must be at least 6 characters long';
  if (password !== confirm) return 'Passwords do not match';
  return null; // No errors
};
