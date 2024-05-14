# Cosmo Core Services

![Banner de Cosmo](./assets/cosmo_banner.svg)

---

1. [Requisitos](#requisitos)
2. [Empezá a desarrollar](#empezá-a-desarrollar)
3. [¿Qué es Cosmo?](#qué-es-cosmo)
4. [Nuestra filosofía](#nuestra-filosofía)
5. [Documentación](#documentación)

---

## Requisitos

-   [Docker](https://www.docker.com/) v26 o mayor
-   Si estás en Windows, usá [WSL 2](https://learn.microsoft.com/es-es/windows/wsl/install) y [Docker Desktop](https://www.docker.com/products/docker-desktop/)

**Otras herramientas**

-   Para administrar MariaDB, es recomendable [DBeaver](https://dbeaver.io/download/)

## Empezá a desarrollar

Primero hay que clonar

```sh
git clone git@github.com:bitargsolutions/cosmo.git
```

Después instalar y configurar el entorno. Primero deberías modificar las variables de entorno en `docker-compose.yml`. Vas a encontrar algo como esto:

```yaml
x-rman-env: &rman-env # -- Set secure password. Should be differents
    MARIADB_PASSWORD: <secure_password>
    MARIADB_ROOT_PASSWORD: <secure_root_password>

    # -- Stage of the app
    #    It should be one of: dev, prod
    MODE: dev

    # -- It should be 128 hex characters
    #    It can be a SHA-512 hash. https://emn178.github.io/online-tools/sha512.html
    SECRET_KEY: <sha512_hash>

    # -- Don't need to modify these
    MARIADB_HOST: rman-mariadb
    COSMO_LOGGER: trace,info,warn,error
    MARIADB_DATABASE: rman
    MARIADB_USER: rman_service
```

En sí la configuración ya está lista para ejecutarse, pero es recomendable cambiar `MARIADB_PASSWORD` y `MARIADB_ROOT_PASSWORD`

Ahora hay que configurar y compilar los proyectos. Esto se hace a través de un contenedor de Docker. Usá el siguiente comando:

```sh
docker compose --profile setup up
```

Es probable que te aparezca un error de _Failed pull image_ o algo similar. Esto es normal y no afecta en el proceso.

Por último, solo queda ejecutar los proyectos y empezar a desarrollar. Usá:

```
docker compose --profile services up
```

Los servicios tienen _hot-reloading_, es decir, no hace falta reiniciar el servidor para que se actualicen los cambios.

## ¿Qué es Cosmo?

¿Qué es _Cosmo_? Podríamos definirlo como un conjunto de herramientas digitales que posibilitan la construcción de una amplia gama de aplicaciones, desde tiendas en línea hasta sistemas de gestión de contenido o aplicaciones móviles.

**Cosmo es como un arsenal de herramientas digitales**. Dentro de este arsenal, encontrarás una variedad de piezas denominadas microservicios. Cada uno de estos microservicios tiene una función específica, como gestionar la autenticación de usuarios, administrar un catálogo de productos o procesar pagos.

Lo destacable de Cosmo es que **tú puedes seleccionar las herramientas que necesitas**. No te bombardearemos con un montón de funcionalidades que tal vez nunca utilices. En lugar de eso, te proporcionamos una versión básica con las funcionalidades esenciales y te permitimos elegir e integrar las que mejor se adapten a tu proyecto específico.

**¿Por qué es esto tan bueno?** Bueno, te permite ahorrar dinero, ya que solo pagas por lo que usas. También evita esa sensación de "sobrecarga" al tener solo lo que necesitas, sin sentirte abrumado por opciones innecesarias. Además, te otorga más libertad para desarrollar, ya que puedes integrar Cosmo con otros servicios con facilidad.

Y aquí viene lo más interesante: **_Cosmo es de código abierto_**. Esto significa que puedes utilizarlo libremente en tus proyectos, modificarlo según tus necesidades y compartirlo con otros desarrolladores. Nos entusiasma la idea de formar una comunidad activa y colaborativa en torno a Cosmo, donde todos puedan contribuir y mejorar juntos.

Nuestro objetivo es hacer que el proceso de desarrollo sea lo más fluido posible. Por eso, te ofrecemos un enfoque de tres pasos: Clonar, Ejecutar y Desarrollar. Con solo unos pocos comandos, podrás comenzar a construir tu aplicación con Cosmo.

## Nuestra filosofía

_Cosmo_ se basa en una filosofía centrada en la libertad, flexibilidad y control para los desarrolladores. Nuestra visión es proporcionar un ecosistema de servicios backend que sea tanto poderoso como adaptable a una amplia gama de casos de uso. Algunos principios clave de nuestra filosofía incluyen:

-   **Libertad de elección**: Creemos en empoderar a los desarrolladores para que elijan las herramientas y servicios que mejor se adapten a sus necesidades específicas. Cosmo ofrece un core de código abierto que puede ser extendido y personalizado según los requerimientos del proyecto.

-   **Flexibilidad y modularidad**: Nuestra arquitectura modular permite a los usuarios integrar y combinar los servicios que necesiten, evitando el abrumador exceso de funcionalidades no deseadas. Esto garantiza una infraestructura backend ágil y optimizada para cada aplicación.

-   **Comunidad activa**: Fomentamos una comunidad de desarrollo vibrante y colaborativa en torno a Cosmo. A través de nuestra política de código abierto y nuestro enfoque en la experiencia del desarrollador, buscamos inspirar la innovación y el intercambio de ideas entre nuestros usuarios.

-   **Autonomía y control**: Con Cosmo, los desarrolladores tienen la libertad de autohospedar su infraestructura backend, lo que les brinda un mayor control sobre su entorno de desarrollo y producción. Esto reduce la dependencia de proveedores externos y promueve la autonomía tecnológica.

## Documentación

Para ver más información, guías y documentación técnica, centralizamos todo en un proyecto de Notion.

_[Documentación de Cosmo - Notion](https://www.notion.so/Documentaci-n-de-Cosmo-3fd3d0bffbaf4ecebbeedf50df0c1d1a?pvs=4)_

---

_Hecho por BitArg_
