import { HttpStatus } from '@nestjs/common';

export type PaginatedResource<T> = {
  totalItems: number;
  items: T[];
  page: number;
  size: number;
};
