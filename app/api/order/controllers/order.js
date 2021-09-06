'use strict';

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
          id: game.id
        });

        if (validGame) {
          games.push(validGame);
        }

      })
    );

    if (!games.length) {
      ctx.response.status = 404;
      return {
        error: "No valid games found!"
      };
    }

    return games;
  }

};
