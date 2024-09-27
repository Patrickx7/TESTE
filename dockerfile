FROM node:18

# Define o diretório de trabalho
WORKDIR /app

# Copie o package.json e o package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install

# Instale globalmente o next, react e react-dom
RUN npm install -g next react react-dom

# Copie o restante do código
COPY . .

# Garanta que o diretório de trabalho tenha permissões corretas
RUN chmod -R 755 /app

# Construa o aplicativo Next.js
RUN npm run build

# Exponha a porta 3000
EXPOSE 3003

# Comando para iniciar o servidor Next.js
CMD ["npm", "start"]