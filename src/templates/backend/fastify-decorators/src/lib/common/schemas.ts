import { Static, TSchema, Type } from "@sinclair/typebox";

export const Nullable = <T extends TSchema>(schema: T) =>
  Type.Union([schema, Type.Null()]);

// Pagination
export enum PaginationOrderEnum {
  /* eslint-disable-next-line no-unused-vars */
  ASC = "ASC",
  /* eslint-disable-next-line no-unused-vars */
  DESC = "DESC",
}

export const paginationSchema = Type.Object({
  page: Type.Number({ default: 1 }),
  limit: Type.Number({ default: 10 }),
  order: Type.Enum(PaginationOrderEnum),
});

export type PaginationSchema = Static<typeof paginationSchema>;
