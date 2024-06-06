import { HttpStatus } from '@nestjs/common';

export type CreateResponse<T> = {
  item: T;
  message: string;
  statusCode: HttpStatus;
};

export type CrudResponse<T> = {
  item: T;
  message: string;
  statusCode: HttpStatus;
};

export type ListResponse<T> = {
  totalItem: number;
  items: T[];
  page: number;
  size: number;
};
