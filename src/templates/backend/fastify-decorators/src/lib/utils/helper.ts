import os from "os";
import * as osu from "node-os-utils";
import { FastifyRequest } from "fastify";
import { LANGUAGE } from "../constants/values";
import { PaginationOrderEnum } from "../common/schemas";
import pkg from "../../../package.json";

export const getReqLanguage = (req: FastifyRequest): LANGUAGE => {
  const lang = req.headers["accept-language"] || "en-US";
  if (lang.toLowerCase() === "id-id") {
    return LANGUAGE.ID;
  }

  return LANGUAGE.EN;
};

export type PaginationParams = {
  take: number;
  skip: number;
  order: PaginationOrderEnum;
};

export const getPagination = (req: FastifyRequest): PaginationParams => {
  const { limit, page, order } = req.query as {
    limit: number;
    page: number;
    order: string;
  };
  const take = (limit && limit > 0 && limit) || 0;
  const skip = limit && page !== undefined && page > 0 ? (page - 1) * limit : 0;
  const orderEnum =
    order && order.toLowerCase() === "asc"
      ? PaginationOrderEnum.ASC
      : PaginationOrderEnum.DESC;

  return { take, skip, order: orderEnum };
};

export const secondsToDurationText = (seconds: number) => {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const dDisplay = d > 0 ? d + (d === 1 ? " day, " : " days, ") : "";
  const hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
  const mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
  const sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
};

export const getSystemMetadata = async () => {
  return {
    service: {
      version: pkg.version,
    },
    system: {
      cpu: {
        average: osu.cpu.average(),
        usage: await osu.cpu.usage(),
        free: await osu.cpu.free(),
        count: osu.cpu.count(),
      },
      memory: {
        free: await osu.mem.free(),
        used: await osu.mem.used(),
      },
      drive: {
        free: await osu.drive.free("/"),
        used: await osu.drive.used("/"),
      },
      os: {
        platform: osu.os.platform(),
        ip: osu.os.ip(),
        hostname: osu.os.hostname(),
        os: osu.os.oos(),
      },
      network: await osu.netstat.stats(),
      uptime: os.uptime(),
    },
  };
};
