# Sistema de Versionamento

## Versão Atual: v0.1.1

### Convenção de Versionamento (Semantic Versioning)

- **MAJOR** (X.0.0): Mudanças incompatíveis na API
- **MINOR** (0.X.0): Novas funcionalidades mantendo compatibilidade
- **PATCH** (0.0.X): Correções de bugs e melhorias menores

### Histórico de Versões

| Versão | Tipo | Descrição | Data |
|--------|------|-----------|------|
| v0.1.1 | PATCH | Aumentado limite de upload para 500MB | 2025-07-06 |
| v0.1.0 | MINOR | Adicionado endpoint /convert-base64 para conversão de áudio base64 | 2025-07-06 |
| v0.01  | INITIAL | Versão inicial com conversão de arquivos por upload | - |

### Comandos para Deploy

```bash
# 1. Atualizar versão no arquivo VERSION
echo "0.1.1" > VERSION

# 2. Build da imagem Docker
docker build -t dncarbonell/ffmpeg-api:v0.1.1 .
docker build -t dncarbonell/ffmpeg-api:v0.1.1-homolog .

# 3. Push para registry
docker push dncarbonell/ffmpeg-api:v0.1.1
docker push dncarbonell/ffmpeg-api:v0.1.1-homolog

# 4. Atualizar docker-compose.yml com nova versão
# 5. Deploy em homologação primeiro, depois produção
```

### Próximas Versões Planejadas

- v0.1.2: Correções e melhorias no endpoint base64
- v0.2.0: Novas funcionalidades de conversão