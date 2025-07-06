# Sistema de Versionamento

## Versão Atual: v0.1.5

### Convenção de Versionamento (Semantic Versioning)

- **MAJOR** (X.0.0): Mudanças incompatíveis na API
- **MINOR** (0.X.0): Novas funcionalidades mantendo compatibilidade
- **PATCH** (0.0.X): Correções de bugs e melhorias menores

### Histórico de Versões

| Versão | Tipo | Descrição | Data |
|--------|------|-----------|------|
| v0.1.5 | PATCH | Correção de diretórios Docker - mudança de __dirname para caminhos absolutos | 2025-07-06 |
| v0.1.4 | PATCH | Melhorias gerais e atualização de versão | 2025-07-06 |
| v0.1.3 | MINOR | Adicionado endpoint /convert-url, suporte a filename customizado, limpeza automática 24h | 2025-07-06 |
| v0.1.2 | PATCH | Corrigido problema de diretório de saída do ffmpeg | 2025-07-06 |
| v0.1.1 | PATCH | Aumentado limite de upload para 500MB | 2025-07-06 |
| v0.1.0 | MINOR | Adicionado endpoint /convert-base64 para conversão de áudio base64 | 2025-07-06 |
| v0.01  | INITIAL | Versão inicial com conversão de arquivos por upload | - |

### Comandos para Deploy

```bash
# 1. Atualizar versão no arquivo VERSION
echo "0.1.5" > VERSION

# 2. Build da imagem Docker
docker build -t dncarbonell/ffmpeg-api:v0.1.5 .
docker build -t dncarbonell/ffmpeg-api:v0.1.5-homolog .

# 3. Push para registry
docker push dncarbonell/ffmpeg-api:v0.1.5
docker push dncarbonell/ffmpeg-api:v0.1.5-homolog

# 4. Atualizar docker-compose.yml com nova versão
# 5. Deploy em homologação primeiro, depois produção
```

### Próximas Versões Planejadas

- v0.1.6: Próximas correções e melhorias
- v0.2.0: Autenticação e rate limiting
- v0.3.0: Interface web para upload