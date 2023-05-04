'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const stateList = [  
      {"state":"Andaman and Nicobar Islands"},
      {"state":"Andhra Pradesh"},
      {"state":"Arunachal Pradesh"},
      {"state":"Assam"},
      {"state":"Bihar"},
      {"state":"Chandigarh"},
      {"state":"Chhattisgarh"},
      {"state":"Dadra and Nagar Haveli and Daman and Diu"},
      {"state":"Delhi"},
      {"state":"Goa"},
      {"state":"Gujarat"},
      {"state":"Haryana"},
      {"state":"Himachal Pradesh"},
      {"state":"Jammu and Kashmir"},
      {"state":"Jharkhand"},
      {"state":"Karnataka"},
      {"state":"Kerala"},
      {"state":"Ladakh"},
      {"state":"Lakshadweep"},
      {"state":"Madhya Pradesh"},
      {"state":"Maharashtra"},
      {"state":"Manipur"},
      {"state":"Meghalaya"},
      {"state":"Mizoram"},
      {"state":"Nagaland"},
      {"state":"Odisha"},
      {"state":"Puducherry"},
      {"state":"Punjab"},
      {"state":"Rajasthan"},
      {"state":"Sikkim"},
      {"state":"Tamil Nadu"},
      {"state":"Telangana"},
      {"state":"Tripura"},
      {"state":"Uttar Pradesh"},
      {"state":"Uttarakhand"},
      {"state":"West Bengal"}
  ]
    const states = stateList.map((state, index) => {
      return {
        id: index+1,
        countryID:101,
        stateName: state.state
      }
    })
    await queryInterface.bulkInsert('states', states, {
      updateOnDuplicate:["stateName", "countryID"]
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('states', null, {});
  }
};
