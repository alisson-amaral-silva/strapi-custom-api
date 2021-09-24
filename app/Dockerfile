FROM strapi/base:14

WORKDIR /opt/app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN npm install --prod

RUN npx browserslist@latest --update-db

RUN npm uninstall sharp

RUN npm install --arch=x64 --platform=linux sharp

RUN npm install pg --save

COPY . .

ENV NODE_ENV production
ENV DATABASE_CLIENT=postgres


RUN npm build

EXPOSE 1337
CMD ["npm", "start"]
