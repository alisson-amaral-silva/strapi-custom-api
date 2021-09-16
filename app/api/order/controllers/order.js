"use strict";

const stripe = require("stripe")(process.env.STRIPE_KEY);
const { sanitizeEntity } = require("strapi-utils");
const orderTemplate = require("../../../config/email-templates/order");

module.exports = {
  createPaymentIntent: async (ctx) => {
    const { cart } = ctx.request.body;

    // simplificando dados do carrinho
    const cartGamesIds = await strapi.config.functions.cart.cartGamesIds(cart);

    //get all games (dentro de config/functions/cart tem o metodo cartItems)
    const games = await strapi.config.functions.cart.cartItems(cartGamesIds);

    if (!games.length) {
      ctx.response.status = 404;
      return {
        error: "No valid games found!",
      };
    }
    const total = await strapi.config.functions.cart.total(games);

    if (total == 0) {
      return {
        freeGames: true,
      };
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd",
        metadata: { cart: JSON.stringify(cartGamesIds) },
      });

      return paymentIntent;
    } catch (err) {
      return {
        error: err.raw.message,
      };
    }
  },

  create: async (ctx) => {
    // pegar informações do front:
    const { cart, paymentIntentId, paymentMethod } = ctx.request.body;

    //pegar token
    const token = await strapi.plugins[
      "users-permissions"
    ].services.jwt.getToken(ctx);

    //pega userId
    const userId = token.id;

    //recuperar informações do user
    const user = await strapi
      .query("user", "users-permissions")
      .findOne({ id: userId });

    // simplificando dados do carrinho
    const cartGamesIds = await strapi.config.functions.cart.cartGamesIds(cart);

    //get all games (dentro de config/functions/cart tem o metodo cartItems)
    const games = await strapi.config.functions.cart.cartItems(cartGamesIds);

    //pegar total (saber se é free ou n)
    const total_in_cents = await strapi.config.functions.cart.total(games);

    //pegar valores do paymentMethod
    let paymentInfo;


    if(total_in_cents != 0){
      try {
       paymentInfo = await stripe.paymentMethods.retrieve(paymentMethod);
      }catch(e) {
        ctx.response.status = 402;
        return { error: e.message };
      }
    }

    //salvar no banco
    const entry = {
     total_in_cents,
     payment_intent_id: paymentIntentId,
     card_brand: paymentInfo && paymentInfo.card.brand,
     card_last4: paymentInfo && paymentInfo.card.last4,
     games,
     user
    };

    try {
      // enviar um email da compra para o usuário
      await strapi.plugins["email-designer"].services.email.sendTemplatedEmail(
        {
          to: user.email,
          from: "no-reply@wongames.com",
        },
        {
          templateId: 1,
        },
        {
          user: user,
          payment: {
            total: `$ ${total_in_cents / 100}`,
            card_brand: entry.card_brand,
            card_last4: entry.card_last4,
          },
          games,
        }
      );
    }catch (err) {
      console.log('📺: ', err);
    }
      // retornando que foi salvo no banco
      return sanitizeEntity(entity, { model: strapi.models.order });
    },
};
