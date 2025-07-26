export const getName = (str: string) =>
  `${str}-${new Date().toISOString().slice(2, 19).replace(/[-:]/g, '').replace('T', '-')}`
