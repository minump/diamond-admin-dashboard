FROM node:22-alpine

# set working directory
WORKDIR /app/

# ENV PATH /src/node_modules/.bin:$PATH
COPY package.json pnpm-lock.yaml* ./

# Install pnpm and dependencies
RUN npm install -g pnpm && pnpm install

# Ensure node_modules/.bin is in the PATH
ENV PATH /app/node_modules/.bin:$PATH

# Copy the rest of your app's source code from your host to your image filesystem, excluding /api/
COPY . .
RUN rm -rf ./api

# Expose the port Next.js will run on
EXPOSE 3000

# run nextJS app
CMD ["pnpm", "next-dev"]