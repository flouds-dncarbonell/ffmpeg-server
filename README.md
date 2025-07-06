# Audio Converter API

API para conversão de arquivos de áudio usando ffmpeg, desenvolvida em Node.js com Express.

## O que foi implementado

### 🚀 Funcionalidades principais
- **Conversão de áudio**: Suporte para conversão entre múltiplos formatos (MP3, WAV, FLAC, OGG, M4A, AAC)
- **Configuração de qualidade**: Opções de bitrate de 64k até 320k
- **Upload de arquivos**: Sistema seguro de upload com validação de tipos e limite de 500MB
- **Conversão base64**: Endpoint para conversão de dados de áudio em base64
- **Conversão via URL**: Baixa e converte arquivos diretamente de URLs
- **Nomenclatura personalizada**: Permite definir nomes customizados para arquivos de saída
- **Geração automática de nomes**: Nomes criptográficos aleatórios quando não especificado
- **Retenção de 24 horas**: Arquivos mantidos por 24h com limpeza automática
- **API RESTful**: Endpoints bem definidos para conversão e consulta
- **Documentação integrada**: Página HTML com todos os endpoints disponíveis
- **Correção de diretórios**: Garantia de criação automática de diretórios necessários

### 📁 Estrutura do projeto
```
vps-video/
├── server.js              # Servidor Express principal
├── package.json           # Dependências e scripts
├── Dockerfile             # Configuração para containerização
├── docker-compose.yml     # Deploy para Portainer
├── .dockerignore          # Arquivos ignorados no build
├── public/
│   └── index.html         # Página de documentação
├── uploads/               # Arquivos temporários de upload
└── temp/                  # Arquivos convertidos temporários
```

### 🛠 Tecnologias utilizadas
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Multer** - Upload de arquivos
- **Fluent-ffmpeg** - Interface para ffmpeg
- **CORS** - Compartilhamento de recursos
- **fs-extra** - Operações de sistema de arquivos
- **Axios** - Cliente HTTP para downloads de URL

### 🔗 Endpoints disponíveis

#### POST /convert
Converte arquivos de áudio para outros formatos
- **Parâmetros**: `audio` (file), `format` (string), `quality` (string), `filename` (string, opcional)
- **Exemplo**: `curl -X POST -F "audio=@arquivo.wav" -F "format=mp3" -F "filename=meu_audio" http://localhost:8765/convert`

#### POST /convert-base64
Converte dados de áudio em base64 para outros formatos
- **Parâmetros**: `data` (string base64), `mimeType` (string), `outputFormat` (string), `quality` (string), `filename` (string, opcional)
- **Exemplo**: `curl -X POST -H "Content-Type: application/json" -d '{"data":"base64data", "mimeType":"audio/wav", "outputFormat":"mp3", "filename":"meu_audio"}' http://localhost:8765/convert-base64`

#### POST /convert-url
Converte arquivos de áudio baixados de URLs
- **Parâmetros**: `url` (string), `outputFormat` (string), `quality` (string), `filename` (string, opcional)
- **Exemplo**: `curl -X POST -H "Content-Type: application/json" -d '{"url":"https://example.com/audio.wav", "outputFormat":"mp3", "filename":"meu_audio"}' http://localhost:8765/convert-url`

#### GET /formats
Lista formatos e qualidades suportados
- **Resposta**: JSON com formatos e qualidades disponíveis

#### GET /health
Verifica status da API
- **Resposta**: Status e timestamp

#### GET /
Página de documentação completa

## Próximos passos

### 🔧 Melhorias técnicas
1. **Implementar autenticação**
   - API keys para controle de acesso
   - Rate limiting para prevenir abuso
   - Logs de auditoria

2. **Otimizações de performance**
   - Queue system para processamento assíncrono
   - Cache de arquivos convertidos
   - Compressão de resposta HTTP

3. **Monitoramento e observabilidade**
   - Métricas de conversão (tempo, taxa de sucesso)
   - Alertas para falhas de conversão
   - Dashboard de uso da API

### 📊 Funcionalidades adicionais
4. **Suporte a mais formatos**
   - Vídeo para áudio (MP4, AVI, MOV)
   - Formatos menos comuns (AIFF, AU, etc.)
   - Metadata preservation

5. **Processamento avançado**
   - Normalização de áudio
   - Remoção de ruído
   - Ajuste de volume automático
   - Corte/trim de arquivos

6. **Interface de usuário**
   - Frontend React/Vue para upload visual
   - Drag & drop de arquivos
   - Preview de áudio
   - Histórico de conversões

### 🚀 Deploy e infraestrutura
7. **Melhorias no deploy**
   - Configuração de reverse proxy (Nginx)
   - SSL/TLS automático
   - Backup automático de configurações

8. **Escalabilidade**
   - Múltiplas instâncias do container
   - Load balancer
   - Armazenamento distribuído

9. **Segurança**
   - Validação rigorosa de arquivos
   - Sandbox para execução do ffmpeg
   - Proteção contra uploads maliciosos

### 💾 Armazenamento
10. **Integração com cloud storage**
    - AWS S3 para arquivos grandes
    - Google Cloud Storage
    - Cleanup automático de arquivos antigos

## Como usar

### Desenvolvimento local
```bash
npm install
npm start
```

### Deploy com Docker
```bash
docker-compose up -d
```

### Deploy no Portainer
1. Faça upload dos arquivos para o GitHub
2. No Portainer, crie uma nova stack
3. Cole o conteúdo do `docker-compose.yml`
4. Configure as variáveis de ambiente se necessário
5. Deploy da stack

## Testes
Teste a API com curl:
```bash
# Testar conversão de arquivo
curl -X POST -F "audio=@teste.wav" -F "format=mp3" -F "quality=192k" -F "filename=teste_convertido" http://localhost:8765/convert --output teste_convertido.mp3

# Testar conversão base64
curl -X POST -H "Content-Type: application/json" -d '{"data":"base64data", "mimeType":"audio/wav", "outputFormat":"mp3", "filename":"base64_convertido"}' http://localhost:8765/convert-base64 --output base64_convertido.mp3

# Testar conversão via URL
curl -X POST -H "Content-Type: application/json" -d '{"url":"https://example.com/audio.wav", "outputFormat":"mp3", "filename":"url_convertido"}' http://localhost:8765/convert-url --output url_convertido.mp3

# Testar health check
curl http://localhost:8765/health

# Ver formatos suportados
curl http://localhost:8765/formats
```

## Considerações de produção
- Configure limites de upload apropriados
- ✅ Cleanup automático de arquivos temporários (24h) - IMPLEMENTADO
- Configure logs estruturados
- Monitore uso de CPU/memória durante conversões
- Considere usar Redis para cache de conversões frequentes
- ✅ Suporte a múltiplas formas de entrada (upload, base64, URL) - IMPLEMENTADO
- ✅ Nomenclatura personalizada de arquivos - IMPLEMENTADO

---

**Próximo passo recomendado**: Implementar autenticação e rate limiting para uso em produção.