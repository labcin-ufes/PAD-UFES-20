# Instalation

In the following, we show some steps to install the frameworks for the server using a Linux distribution:


### Installing OpenJDK 8

1. Include the OpenJDK 8 repository into `apt-get`:

`sudo add-apt-repository ppa:openjdk-r/ppa`

2. Update `apt-get`:

`sudo apt-get update`

3. Install:

`sudo apt-get install openjdk-8-jdk`


4. Checking the version:
`java -version`

### Installing Maven

Maven is the Java/SpringBoot dependecy manager. To install it you can do:
Maven é o gerenciador de dependências utilizado para o Java/Spring Boot. Sua instalação é bem simples:

`sudo apt-get install maven`

### Installing MySQL
To install it, do: `sudo apt-get install mysql-server`

Do not skip the configuration. Make sure to set you `USER_NAME` and `USER_PASSWD`

# Running the server

To run the server, you must follow these steps:

1. You must create a database on MySQL named `DATABASE_NAME`. 


2. Now, create a file named `application.properties` inside `server/src/main/resources/` with the following instructions:

```
spring.datasource.username=USER_NAME
spring.jpa.generate-ddl=true
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL5Dialect
spring.servlet.multipart.max-file-size=100MB
spring.servlet.multipart.max-request-size=200MB
spring.data.rest.base-path=/api
server.servlet.session.timeout=300m
security.basic.enabled=false


spring.datasource.url=jdbc:mysql://localhost/DATA_BASE_NAME?useTimezone=true&serverTimezone=UTC
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.password=USER_PASSWD
server.port=8080
tipo.operacao=dev

# ON DEPLOYING UNCOMMENT THE LINES BELOW
# spring.datasource.password=PROD_PASSWD
# server.port=80
# tipo.operacao=prod

# Configurações para mudar o path de origem
server.servlet.contextPath=/sade
server.use-forwarded-headers=true

# Configuracoes da URL do servidor remoto:
servidor.remoto.url=SERVER_URL

# Token para acessar API aberta
token.api = YOUR_API_TOKEN



spring.jackson.date-format=yyyy-MM-dd
spring.jackson.time-zone=Brazil/East


spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=YOUR_EMAIL@gmail.com
spring.mail.password=YOUR_PASSWD
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.ssl.enable=false
spring.mail.test-connection=true

#management.endpoints.web.cors.allow-credentials=* # Whether credentials are supported. When not set, credentials are not supported.
management.endpoints.web.cors.allowed-headers=* # Comma-separated list of headers to allow in a request. '*' allows all headers.
management.endpoints.web.cors.allowed-methods=* # Comma-separated list of methods to allow. '*' allows all methods. When not set, defaults to GET.
management.endpoints.web.cors.allowed-origins=* # Comma-separated list of origins to allow. '*' allows all origins. When not set, CORS support is disabled.
management.endpoints.web.cors.exposed-headers=* # Comma-separated list of headers to include in a response.
management.endpoints.web.cors.max-age=3600s
```


2. Open a terminal and do: `mvn spring-boot:run`

3. Now, SpringBood (via Tomcat) will up a server on `http://localhost:8080`. Just open it and have fun!


# Documentation

+ [Spring-boot](https://spring.io/projects/spring-boot)
* [Java](https://www.java.com/en/download/help/download_options.xml)
* [Maven](https://maven.apache.org/)
* [MySQL](https://www.mysql.com/downloads/)
+ [Spring Data JPA](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
+ [Spring Data Rest 1](https://spring.io/guides/gs/accessing-data-rest/)
* [Spring Data Rest 2](https://docs.spring.io/spring-data/rest/docs/current/reference/html/)



