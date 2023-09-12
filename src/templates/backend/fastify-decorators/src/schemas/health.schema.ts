import { Static, Type } from "@sinclair/typebox";

export const healthResponseItem = Type.Object({
  service: Type.Object({
    name: Type.String(),
    version: Type.String(),
  }),
  uptime: Type.String(),
  date: Type.String(),
  status: Type.String(),
});

export const checkHealthResponse = Type.Object({
  status: Type.Integer(),
  message: Type.String(),
  data: healthResponseItem,
});

export type HealthResponseItem = Static<typeof healthResponseItem>;

export type CheckHealthResponse = Static<typeof checkHealthResponse>;
