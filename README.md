# Sitio web Capa 7 - Grupo 2

Sitio 100% HTML sobre la capa de aplicación del modelo OSI (Redes de Computadoras).

## Integrantes
- Camilo Rubiano
- Diego Vargas
- Julián Rubiano

## Estructura
```
repo-grupo/
├── README.md
├── Dockerfile
├── index.html
├── css/
├── img/
└── integrantes/
    ├── integrante1.html
    ├── integrante2.html
    └── integrante3.html
```

## Cómo ejecutarlo con Docker
Requisito: tener Docker instalado.

```bash
git clone https://github.com/USUARIO/redes-capa7-grupo2.git
cd redes-capa7-grupo2
docker build -t sitio-capa7 .
docker run -d -p 8080:80 --name sitio-capa7 sitio-capa7
```
Abrir en el navegador: http://localhost:8080

## Detener y eliminar el contenedor
```bash
docker stop sitio-capa7 && docker rm sitio-capa7
```

## Verificar HTTP (capa 7)
```bash
curl -I http://localhost:8080
```
