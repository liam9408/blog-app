import moment from 'moment';
import { isNil, omitBy, isNaN } from 'lodash';
import { Op, fn, col, literal } from 'sequelize';

/**
 * Parse sequelize model to create a model spec.
 *
 * Example usage:
 * ```
 * MyModel.findAll({
 *   ...getOrderOptions([{
 *     sortBy: 'fieldName',
 *     sortOrder: 'desc',
 *   }]),
 * });
 * ```
 *
 * @param {Object[]} sortBys Sequelize model
 * @param {string} sortBys[].sortKey Path of the sort field
 * @param {string} sortBys[].sortOrder Sort order. Accepted values = `asc`, `desc`
 * @returns {SequelizeOrderOption} Sequelize order option
 */

export interface Range {
  start?: string | Date | number;
  end?: string | Date | number;
}

export interface TimeRange {
  startDate?: string | Date;
  endDate?: string | Date;
}

const DEFAULT_QUERY_LIMIT = 1000;

const getPagination = (rawLimit: any, rawOffset: any) => {
  const limit = parseInt(rawLimit, 10);
  const offset = parseInt(rawOffset, 10);

  const hardLimit = DEFAULT_QUERY_LIMIT;
  const hardOffset = 0;

  let restrictedLimit = limit;
  if (!limit || limit > hardLimit) {
    restrictedLimit = hardLimit;
  }

  let restrictedOffset = offset;
  if (!offset || offset < hardOffset) {
    restrictedOffset = hardOffset;
  }

  return omitBy(
    {
      limit: restrictedLimit,
      ...omitBy(
        {
          offset: restrictedOffset,
        },
        isNaN
      ),
    },
    (value) => isNil(value) || isNaN(value)
  );
};

const getOrderOptions = (sortBys: any) => {
  const options = sortBys
    .filter(({ sortKey, sortOrder }: any) => sortKey && sortOrder)
    .map(
      ({
        sortKey,
        sortOrder,
        caseInsensitive = false,
        tableName = '',
        needUnambiguous = false,
      }: any) => {
        if (
          !sortKey ||
          (typeof sortKey === 'string' && sortKey.includes('.'))
        ) {
          return [...sortKey.split('.'), sortOrder];
        }

        const column = needUnambiguous
          ? `${tableName}.${sortKey}`
          : `${sortKey}`;
        if (caseInsensitive) {
          return [fn('lower', col(column)), sortOrder]; // order case-insensitive
        }
        return [col(column), sortOrder]; // order case-sensitive
      }
    );
  return options.length > 0 ? { order: options } : {};
};

export { getPagination, getOrderOptions };
