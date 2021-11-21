const express = require('express')
const router = express.Router()
const mongoose = require('mongoose'),
  FoodItems = mongoose.model('FoodItem');

router.get('/', (req, res, next) => {
  // Access the provided 'page' and 'limt' query parameters
  let query = req.query.query ?? '';
  let limit = req.query.limit;
  FoodItems.find({
    name: {
        $regex: query.trim(),
        $options: 'i',
    },
  }).exec(function(err, items) {
		if(!items) {
			res.json(404, {
				err: 'No Items found.'
			});
		} else {
			res.json(items);
		}
	});
})

module.exports = router