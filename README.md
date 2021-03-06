# PLATAFORMA IOT PARA EL REGISTRO DE DATOS METEOROLÓGICOS Y SU VISUALIZACIÓN MEDIANTE UNA APLICACIÓN MÓVIL

# Resumen:
En la actualidad, existe un concepto que está cobrando especial relevancia, el cual es
conocido como IoT (Internet of Things, Internet de las Cosas).
En el IoT se define la interconexión digital de objetos cotidianos con internet, esto
significa que no sólo “los humanos” tenemos la capacidad de conectarnos a internet, sino que
caminamos hacia una nueva era donde prácticamente cualquier cosa podría ser conectada a
internet, desde un reloj (smartwatch), como tenemos en la actualidad, hasta una nevera, una
persiana, etc.
En este proyecto se ha querido aplicar ciertas fases del IoT, para convertir una
información ambiental, proporcionada por una pequeña estación meteorológica, en un valor
adicional a la hora de tomar decisiones basadas en las variables ambientales. Para ello utilizamos
una serie de sensores que se encargan de darnos la información ambiental necesaria (como la
temperatura, humedad y presión atmosférica), una fuente de procesamiento como puede ser un
microcontrolador, una transmisión de datos entre estaciones, usamos las capacidades de la
estación base para después poder manejar la información y procesarla en la nube, de forma
remota, adquiriendo así el valor añadido que se espera en el IoT.
Para manejar todos estos conceptos y elementos, se hace uso de una aplicación
multiplataforma, bases de datos, procesamiento, integrando todos los servicios en una misma
plataforma que facilite la comunicación de todos los elementos involucrados.

# Abstract:
Currently, there is a concept that is gaining special relevance, this concept is known as
IoT (Internet of Things).
IoT defines digital interconnection of everyday objects to internet, this means humans
will no longer be the only ones with the ability to connect to internet. We walk into a new era
where anything could be virtually connected to Internet, from a clock (smartwatch), as we have
today, to a refrigerator, a blind, etc.
In this project we have tried to apply certain phases of IoT, to convert a bit biased
environmental information, in an additional value when making decisions about environmental
conditions based on individual perceptions. We use different sensors that are responsible for
giving the necessary environmental information (such as temperature, humidity, or atmospheric
pressure), a source of processing such as a micro-controller, a data transmission between
stations, we use the capabilities of the base station to later handle the information and process it
in the cloud, remotely, thus acquiring the added value expected in the IoT.
To handle all these things, we make use of a multiplatform application, databases,
automated processing, integrating all those services on a single platform that facilitates
communication of all these elements.

# Introducción:
Trabajo de Fin de Grado de la titulación de Ingeniería Informática de Gestión y Sistemas de Información.

El proyecto consistía en registrar datos meteorológicos en una plataforma en la nube basada en IoT y visualizar los datos a través de una aplicación multiplataforma.

Para el registro de datos se utilizaban dos estaciones, una remota/estacionada, la cual será la encargada de recoger datos como la temperatura, humedad, presión atmosférica y localización (obtener las coordenadas mediante un módulo GPS); la otra, en cambio, era una estación base que recibirá los datos de la estación remota y realizará una transmisión de los datos recibidos a la nube. La plataforma en la que se alojaban los datos era ThingSpeak, dedicada al almacenamiento de datos de plataformas IoT.

La estación meteorológica se construyó a traves de placas Arduino y sus respectivas conexiones con módulos. Además, la progrmación de esta se hizo a traves del lenguaje nativo e IDE propio de Arduino.

La visualización de los datos, cómo ya he dicho, se realizó a través de una aplicación móvil muliplataforma desarrollada con la tecnología que proporcion Ionic. Esta tecnología es capaz de crear aplicaciones híbridas mediante lengujaes de programacióm cómo JavaScript, HTML y CSS.

La aplicación contaba con gráficas representativas, evolución de los datos, comparativas con otras zonas, geolocalización de la estación remota, etc.
