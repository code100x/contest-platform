import bcrypt from "bcrypt";

const hash = (password: string) => {
  const hashed = bcrypt.hash(password, 10);

  return hashed;
};
const compare = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export { hash, compare };
