/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import { Entity } from "typeorm";
import { BaseEntity } from "../../lib/common/entity";

@Entity({ name: "samples", schema: "public" })
export class Samples extends BaseEntity {}
