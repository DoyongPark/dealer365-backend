FROM node:20-alpine

RUN mkdir -p /nest
ADD . /nest

WORKDIR /nest

RUN yarn global add @nestjs/cli

RUN yarn install --production=false

# Build production files
# RUN nest build shared
# RUN nest build database
# RUN nest build nest
RUN nest build api-crm

# Bundle app source
COPY . .

EXPOSE 3000
CMD ["node", "dist/apps/api-crm/main.js"]
