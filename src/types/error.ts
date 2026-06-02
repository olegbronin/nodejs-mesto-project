export interface MongooseError extends Error {
  name: string;
  code?: number;
  errors?: Record<string, { message: string }>;
}

export const isMongooseError = (err: unknown): err is MongooseError => {
  return err instanceof Error && 'name' in err;
};