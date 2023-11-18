
---

# raspy-watch-api

Esta é uma API para streaming de vídeos com funcionalidades de upload, armazenamento e transmissão de vídeos para clientes conectados em tempo real.

## Configuração

Antes de iniciar a aplicação, você precisará configurar algumas variáveis de ambiente. Copie o arquivo `.env.example` para um novo arquivo chamado `.env` e preencha as variáveis com os valores corretos:

### Variáveis para configuração do servidor de aplicação

- `PORT`: Porta em que o servidor será executado.

### Variáveis para configuração do servidor de armazenamento de arquivos

- `UPLOAD_FOLDER`: Pasta onde os arquivos serão armazenados localmente antes de serem enviados para o servidor de armazenamento.
- `ENDPOINT_S3`: Endereço do servidor de armazenamento.
- `KEY_ID`: ID da chave de acesso ao servidor de armazenamento.
- `APP_KEY`: Chave de acesso ao servidor de armazenamento.
- `BACKBLAZE_BUCKET`: Nome do bucket no servidor de armazenamento.
- `REGION`: Região do servidor de armazenamento.

## Como executar

1. Instale as dependências usando o npm:

   ```
   npm install
   ```

2. Inicie o servidor:

   ```
   npm start
   ```

O servidor estará disponível em `http://localhost:<PORT>`.

## Rotas disponíveis

- `/upload`: Rota para fazer upload de vídeos.
- `/`: Rota para assistir ao vídeo em streaming.

## Exemplo de Uso

### Upload de vídeo

Faça uma requisição POST para `/upload` enviando um arquivo de vídeo no corpo da requisição.

Exemplo usando cURL:

```bash
curl -X POST -F "video=@caminho/do/seu/video.mp4" http://localhost:<PORT>/upload
```

### Assistir ao vídeo

Abra um navegador e acesse `http://localhost:<PORT>/` para assistir ao vídeo em streaming.

---

