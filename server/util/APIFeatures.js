class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    // console.log('filterrrrrrrrrrrrrrrr');
    const queryObj = { ...this.queryString };
    const excluded_fields = ['page', 'sort', 'limit', 'fields'];
    excluded_fields.forEach(el => delete queryObj[el]);
    //  1B) ADVANCED FILTERING
    const queryStr = JSON.stringify(queryObj);
    const queryStrWithDollarSign = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    );
    // console.log(JSON.parse(queryStrWithDollarSign));
    const queryObjWithDollarSign = JSON.parse(queryStrWithDollarSign);
    this.query = this.query.find(queryObjWithDollarSign); // the query is a query object that is not executed yet in this case it is  after filtering
    return this;
  }
  sort() {
    // 2) SORTING
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' '); // sort('price ratingsAverage')
      // console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    // 3) FIELD LIMITING
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' '); // 'name duration price'
      this.query = this.query.select(fields); // select('name duration price')
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  paginate() {
    // 4) PAGINATION
    const page = +this.queryString?.page || 1;
    const limit = +this.queryString?.limit || 100;
    const skip = (page - 1) * limit; // page=3& limit=10,( 1-10, page 1), (11-20, page 2),( 21-30, page 3)
    this.query = this.query.skip(skip).limit(limit);
    /**
     *  query = query.skip(skip).limit(limit);
     * is used to implement pagination if there was no page query in the url then the query will be like this: query = query.skip(0).limit(100); as default page=1 and limit=100
     */
    return this;
  }
}
module.exports = APIFeatures;
