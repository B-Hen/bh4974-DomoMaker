const models = require('../models');

const { Domo } = models;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occureed' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.level) {
    return res.status(400).json({ error: 'RAWR! Name, age, and level are required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    level: req.body.level,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return domoPromise;
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ domos: docs });
  });
};

const deleteDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findAndDelete(req.body.domoId, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ message: 'DeleteDomo' });
  });
};


module.exports.makerPage = makerPage;
module.exports.getDomos = getDomos;
module.exports.deleteDomos = deleteDomos;
module.exports.make = makeDomo;


/*
  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    let domos = docs;
    let index;
    let domosID;
    let requestID;

    for(let i = 0; i < domos.length; i++)
    {
      //Turn to string to do a proper comparison
      domosID = String(domos[i]._id).trim();
      requestID = String(req.body.domoId).trim();

      //check to see if the IDs match
      if(domosID === requestID)
      {
        index = i;
      }
    }
    Domo.DomoModel.findAndDelete(domosID);
    return res.status(200).json({messahge: 'Deleted Domo'});
  });

*/
