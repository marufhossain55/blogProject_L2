/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterQuery, ObjectId, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;
  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const search = this?.query?.search || '';
    this.modelQuery = this.modelQuery.find({
      $or: searchableFields.map((field: any) => ({
        [field]: { $regex: search, $options: 'i' },
      })),
    } as FilterQuery<T>);
    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludingImportant = ['search', 'sortOrder', 'sortBy'];
    excludingImportant.forEach((key) => delete queryObj[key]);
    // console.log(queryObj, excludingImportant, 'queryObj');
    if (queryObj?.filter) {
      this.modelQuery = this.modelQuery.find({
        author: { _id: queryObj.filter as ObjectId },
      });
    }
    return this;
  }

  sort() {
    let sortStr = '-createAt';
    if (this?.query?.sortBy && this?.query?.sortOrder) {
      const sortBy = this?.query?.sortBy;
      const sortOrder = this?.query?.sortOrder;
      sortStr = `${sortOrder === 'desc' ? '-' : ''}${sortBy}`;
    }
    this.modelQuery = this.modelQuery.sort(sortStr);
    return this;
  }
}
export default QueryBuilder;
