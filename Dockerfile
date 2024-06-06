FROM node:18-alpine AS deps
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn config set registry https://registry.npmmirror.com
RUN yarn install

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn config set registry https://registry.npmmirror.com
RUN yarn build &&  yarn install --production 


FROM node:18-alpine AS runner

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN yarn config set registry https://registry.npmmirror.com

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000



CMD ["node_modules/.bin/next", "start"]