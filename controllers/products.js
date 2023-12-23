const client = require('../db/connect');
const db = client.db('store').collection('products')

const getAllProducts = async(req, res, next) => {
  try {
    const { featured, company, name, filter, fields, numericFilters } = req.query;
    const queryObject = {};
    if (featured) {
      queryObject.featured = featured === 'true' ? true : false;
    }

    if (company) {
      queryObject.company = company;
    }

    if (name) {
      queryObject.name = { $regex: name, $options: 'i' };
    }

    let fieldsList = {}
    if (fields) {
      let arr = fields.split(', ');
      for(let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].trim()
        if(!(arr[i] in fieldsList)) {
          fieldsList[arr[i]] = 1
        }
      }
    }

    let result = db.find(queryObject, fieldsList)

    if(filter) {
      let map = {}
      filter.split(',').forEach(element => {
        if(element.startsWith('-')) {
          element = element.replace(/^./, "")
          map[element] = -1
        } else {
          element = element.replace(/^./, "")
          map[element] = 1
        }
        return map
      });
      result = result.sort(map);
    }

    if(numericFilters) {
      const operatorMap = {
        '>': '$gt',
        '>=': '$gte',
        '=': '$eq',
        '<': '$lt',
        '<=': '$lte',
      };
      const regEx = /\b(<|>|>=|=|<|<=)\b/g;
      let filters = numericFilters.replace(
        regEx,
        (match) => `-${operatorMap[match]}-`
      );
      const options = ['price', 'rating'];
      filters = filters.split(',').forEach((item) => {
        const [field, operator, value] = item.split('-');
        if (options.includes(field)) {
          queryObject[field] = { [operator]: Number(value) };
        }
      });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    const products = await result.toArray()
    res.status(200).json({  products, nbHits: products.length});
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllProducts
};
