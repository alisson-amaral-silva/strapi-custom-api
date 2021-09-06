'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  createPaymentIntent: async (ctx) => {
    const { cart } = ctx.request.body;

    let games = [];

    await Promise.all(
      cart?.map(async (game) => {
        //recuperando dados de outros serviços no strapi
        const validGame = await strapi.services.game.findOne({
          id: game.id,
        });

        if (validGame) {
          games.push(validGame);
        }
      })
    );

    if (!games.length) {
      ctx.response.status = 404;
      return {
        error: 'No valid games found!',
      };
    }

    //iteração sobre o array, permitindo um parametro de acumulador =>
    // para somar e uma variavel a ser utilizada
    //o zero no final é o valor inicial
    const total = games.reduce((acc, game) => {
      return acc + game.price;
    }, 0);

    return { total_in_cents: total * 100, games };
  },
};
