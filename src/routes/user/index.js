const Joi = require("joi");

const {
  createNewUser,
  getCurrentUser,
} = require("../../handlers/user_handler");
const responseSchema = require("../../helpers/responseSchema");

module.exports = [
  {
    method: "POST",
    path: "/user",
    options: {
      auth: false,
      tags: ["api"],
      description: `this route is used to create new user.`,
      validate: {
        payload: Joi.object({
          username: Joi.string().required(),
          phonenum: Joi.string().required(),
          email: Joi.string().required(),
          password: Joi.string().required(),
        }).label("create user request"),
      },
      response: {
        status: {
          201: responseSchema
            .append({
              data: Joi.object()
                .keys({
                  username: Joi.string().required(),
                  phonenum: Joi.string().required(),
                  email: Joi.string().required(),
                })
                .label("user data response"),
            })
            .label("create user response"),
        },
      },
    },
    handler: createNewUser,
  },
  {
    method: "GET",
    path: "/user",
    options: {
      auth: "user-access-control",
      tags: ["api"],
      description: `This route is used to get user information. `,
      notes: `This route is protected by user-access-control strategy.
      This route can only be accessed by authenticated user when the token is stored in cookie header with access_token key and issued each time request is made.
      The user can only retrieve information of its own.
      `,
      validate: {
        headers: Joi.object({
          cookie: Joi.string().required(),
        }),
        options: {
          allowUnknown: true,
        },
      },
      response: {
        status: {
          200: responseSchema
            .append({
              data: Joi.object()
                .keys({
                  username: Joi.string().required(),
                  phonenum: Joi.string().required(),
                  email: Joi.string().required(),
                })
                .label("user data response"),
            })
            .label("get user response"),
          401: responseSchema.label("unauthorized access response"),
        },
      },
    },
    handler: getCurrentUser,
  },
];
