## 📝 Challenge Backend

**Resumen:**
Desarrollar una API que permita obtener la siguiente información a traves de endpoints:

- **Buscar activos**:
  - La respuesta deberá devolver el listado de activos similares a la busqueda realizada dentro del mercado (tiene que soportar busqueda por ticker y/o por nombre).

- **Portfolio**:
  - La respuesta deberá devolver:
      - Pesos disponibles para operar
      - Valor total de la cuenta de un usuario
      - Listado de activos que posee.
  - Para calcular el valor de mercado, rendimiento y cantidad de acciones de cada posición usar las ordenes en estado `FILLED` de cada activo.
  - Para hacer el calculo de la tenencia y pesos disponibles, utilizar todos los movimientos que hay en la tabla `orders`, utilizar columna `size`.
  - En la tabla `marketdata` se encuentras los precios de los ultimos 2 dias de los instrumentos. 
  - El `close`, es el último precio de cada activo. Para calcular el retorno diario utilizar las columnas `close` y `previousClose`.

- **Enviar una orden al mercado**:
  - A traves de este endpoint se podrá enviar una orden de compra o venta del activo.
  - Soportando dos tipos de ordenes: MARKET y LIMIT.


## 🔄 Consideraciones funcionales
- Estoy obviando las transacciones con status = NEW, no las considero para el balance disponible ni activo en la cartera (está en un limbo)
- En la DB figura como BUY 20 / SELL 30 FILLED para el instrumento BMA (instrumentId 31) No debería ser correcto no ??? (existe una en NEW que compensa)

# GENERAL ORDERS
- Los precios de los activos tienen que estar en pesos.
- NO hace falta simular el mercado.
- Las ordenes tienen un atributo llamado `side` que describe si la orden es de compra (`BUY`) o venta (`SELL`).
- La orden quedará grabada en la tabla `orders` con el estado y valores correspondientes.
- El cash (ARS) esta modelado como un instrumento de tipo 'MONEDA'.

- Las ordenes tienen distintos estados (status): 
    - `NEW` - cuando una orden LIMIT es enviada al mercado, se envía con este estado.
    - `FILLED` - cuando una orden se ejecuta. Las ordenes MARKET son ejecutadas inmediatamente al ser enviadas.
    - `REJECTED` - cuando la orden es rechazada por el mercado ya que no cumple con los requerimientos, como por ejemplo cuando se envía una orden por un monto mayor al disponible.
    - `CANCELLED` - cuando la orden es cancelada por el usuario.

# CREATE ORDER
  - Cuando un usuario envía una orden, es necesario enviar la cantidad de acciones que quiere comprar o vender.

  # BUY - MARKET (type: MARKET, size?: 10, amount?: 12000)
  - Las ordenes MARKET no requieren que se envíe el precio ya que se ejecutara la orden con las ofertas del mercado.
  - Cuando un usuario manda una orden de tipo MARKET, la orden se ejecuta inmediatamente y el estado es `FILLED`.
  - Cuando se envia una orden de tipo `MARKET`, utilizar el último precio (`close`).
  - Validar en caso de compra que el usuario tiene los pesos suficientes para comprar 
  - Permitir al usuario enviar la cantidad de acciones exactas o un monto total de inversión en pesos (en este caso, calcular la cantidad de acciones máximas que puede enviar, no se admiten fracciones de acciones).

  # BUY - LIMIT (type: MARKET, size?: 10, price: 99)
  - Cuando un usuario manda una order de tipo LIMIT, el estado de la orden tiene que ser `NEW`.
  - Las ordenes LIMIT requieren el envío del precio al cual el usuario quiere ejecutar la orden.
  - Validar en caso de compra que el usuario tiene los pesos suficientes para comprar.

  # SELL
  - Validar en caso de venta que el usuario tiene las acciones suficientes para vender.

  # CANCEL ORDER
  - Solo se pueden cancelar las ordenes con estado `NEW`.
  - Si la orden enviada es por un monto mayor al disponible, la orden tiene que ser rechazada y guardarse en estado REJECTED.

  # CASH IN - CASH OUT
  - Las transferencias entrantes y salientes se pueden modelar como ordenes. 
  - Las transferencias entrantes tiene side `CASH_IN` mientras que las salientes side `CASH_OUT`.
  - Cuando una orden es ejecutada, se tiene que actualizar el listado de posiciones del usuario.

# Consideraciones técnicas
- **Para la API REST**
- Implementar un test funcional sobre la función para enviar una orden.
- Proveer una coleccion de Postman, Insomnia o REST Client para la API y ejemplos de como invocarla.
- Documentá cualquier suposición o decisión de diseño que consideres relevante.

# Base de datos
Como referencia, ya hemos creado una base de datos con las siguientes tablas y algunos datos (archivo `database.sql`):
- **users**: id, email, accountNumber
- **instruments**: id, ticker, name, type
- **orders**: id, instrumentId, userId, side, size, price, type, status, datetime
- **marketdata**: id, instrumentId, high, low, open, close, previousClose, datetime

La base de datos provista es un modelo funcional que sirve tal como está, aunque es una implementación básica. El candidato tiene la libertad de modificar, agregar o ajustar tablas según lo considere necesario para mejorar la performance del código, optimizar consultas, o por cualquier otra razón técnica relevante. Es importante justificar adecuadamente cualquier cambio en la documentación.

## PARA REALIZAR PRUEBAS, SEGUIR LOS SIGUIENTES PASOS:

## Create database service

```bash
$ docker compose up -d
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
