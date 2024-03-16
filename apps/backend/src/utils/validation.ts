import { AnyZodObject, ZodError } from 'zod';

export async function validate(schema: AnyZodObject, data: any) {
  try {
    schema.parse(data);
    return {
        ok: true,
        message:''
    }
  } catch (error) {
    if (error.name === 'ZodError') {
      const message = (error as ZodError).issues
        ?.map((issu) => issu.message)
        .join(', ');
      return {ok:false, message};
    }
  }
}
