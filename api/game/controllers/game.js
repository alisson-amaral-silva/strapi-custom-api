'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#controllers)
 * to customize this controller
 */

module.exports = {
  // a variavel ctx contem todas as informações relacionadas ao request e response
  // o strapi utiliza o KOA por baixo dos panos, então da pra verificar na documentação do KOA
  // coisas sobre objetos derivados do request e response
  // request: (https://koajs.com/#request)
  // response: (https://koajs.com/#response)
  populate: (ctx) => {
    console.log('Starting to populate...');
    ctx.send("Finished populating!");
  },
};
