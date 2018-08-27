module.exports = function(app, passport) {

    var katta = require('../controllers/katta.controller.js');
    app.post('/CreateAdmin', katta.create);
    app.post('/login', katta.login);

    app.post('/addCustomer', katta.createCustomer);

    app.post('/addRemarks', katta.createRemarks);

    app.get('/getAllCustomers', katta.findAll);

    app.post('/getCustomer', katta.getOneList);

    app.delete('/deleteCustomer/:customerId', katta.delete);
    
    app.put('/updateCustomer/:mobile', katta.update);
};