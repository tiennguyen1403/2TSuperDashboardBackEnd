import {
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';
import {
  FilterRule,
  Filtering,
} from '../decorators/filtering-params.decorator';
import { Sorting } from '../decorators/sorting-params.decorator';

export const getOrder = (sort: Sorting) => {
  return sort ? { [sort.property]: sort.direction } : {};
};

export const getWhere = (filter: Filtering) => {
  if (!filter) return {};

  switch (filter.rule) {
    case FilterRule.IS_NULL: {
      return { [filter.property]: IsNull() };
    }
    case FilterRule.IS_NOT_NULL: {
      return { [filter.property]: Not(IsNull()) };
    }
    case FilterRule.EQUALS: {
      return { [filter.property]: filter.value };
    }
    case FilterRule.NOT_EQUALS: {
      return { [filter.property]: Not(filter.value) };
    }
    case FilterRule.GREATER_THAN: {
      return { [filter.property]: MoreThan(filter.value) };
    }
    case FilterRule.GREATER_THAN_OR_EQUALS: {
      return { [filter.property]: MoreThanOrEqual(filter.value) };
    }
    case FilterRule.LESS_THAN: {
      return { [filter.property]: LessThan(filter.value) };
    }
    case FilterRule.LESS_THAN_OR_EQUALS: {
      return { [filter.property]: LessThanOrEqual(filter.value) };
    }
    case FilterRule.LIKE: {
      return { [filter.property]: ILike(`%${filter.value}%`) };
    }
    case FilterRule.NOT_LIKE: {
      return { [filter.property]: Not(ILike(`%${filter.value}%`)) };
    }
    case FilterRule.IN: {
      return { [filter.property]: In(filter.value.split(',')) };
    }
    case FilterRule.NOT_IN: {
      return { [filter.property]: Not(In(filter.value.split(','))) };
    }
    default: {
      return {};
    }
  }
};
