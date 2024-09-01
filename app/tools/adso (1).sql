-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 02-09-2024 a las 00:31:37
-- Versión del servidor: 8.3.0
-- Versión de PHP: 8.1.2-1ubuntu2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `proyectobecerra`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`proyectobecerra`@`%` PROCEDURE `SP_AsignarRolUsuario` (IN `p_usuario_id` INT, IN `p_rol_id` INT)   BEGIN
    DECLARE usuario_existe INT;
    DECLARE rol_existe INT;
    
    -- Verificar si el usuario existe
    SELECT COUNT(*) INTO usuario_existe FROM usuario WHERE id = p_usuario_id;
    
    -- Verificar si el rol existe
    SELECT COUNT(*) INTO rol_existe FROM rol WHERE id = p_rol_id;
    
    -- Si ambos existen, actualizar el rol del usuario
    IF usuario_existe > 0 AND rol_existe > 0 THEN
        UPDATE usuario SET id_rol = p_rol_id WHERE id = p_usuario_id;
        SELECT 'Rol asignado correctamente' AS mensaje;
    ELSE
        SELECT 'Error: Usuario o Rol no existe' AS mensaje;
    END IF;
END$$

CREATE DEFINER=`proyectobecerra`@`%` PROCEDURE `SP_BuscarUsuario` (IN `_nombre_usuario` VARCHAR(255))   BEGIN
    -- Selecciona el usuario y la contraseña desde la tabla de usuarios
    SELECT nombre_usuario, contrasena_hash
    FROM usuario
    WHERE nombre_usuario = _nombre_usuario
    LIMIT 1;
END$$

CREATE DEFINER=`proyectobecerra`@`%` PROCEDURE `SP_CrearUsuario` (IN `_nombre_usuario` VARCHAR(255), IN `_nombre` VARCHAR(255), IN `_contrasena_hash` VARCHAR(255), IN `_email` VARCHAR(255))   BEGIN

INSERT INTO usuario(nombre_usuario, nombre, contrasena_hash, email)
VALUES (_nombre_usuario, _nombre, _contrasena_hash, _email);

END$$

CREATE DEFINER=`proyectobecerra`@`%` PROCEDURE `SP_ObtenerPanelControlUsuarios` ()   BEGIN
    SELECT 
        u.id AS ID,
        u.nombre AS Nombre,
        u.email AS Correo,
        u.contrasena_hash AS Contrasena,
        r.nombre AS Rol,
        e.tipo_estado AS Estado
    FROM 
        usuario u
    LEFT JOIN 
        rol r ON u.id_rol = r.id
    LEFT JOIN 
        estado e ON u.id_estado = e.id
    ORDER BY 
        u.id;
END$$

CREATE DEFINER=`proyectobecerra`@`%` PROCEDURE `SP_VerificarRoles` (IN `_nombre` VARCHAR(255))   BEGIN
   SELECT u.id_rol, u.nombre_usuario, u.nombre, u.email, u.contrasena_hash FROM usuario u WHERE u.nombre_usuario = _nombre;
END$$

CREATE DEFINER=`proyectobecerra`@`%` PROCEDURE `SP_VerificarUsuario` (IN `_nombre_usuario` VARCHAR(255))   BEGIN

SELECT nombre_usuario FROM usuario WHERE nombre_usuario = _nombre_usuario;

END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administrador`
--

CREATE TABLE IF NOT EXISTS `administrador` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_estado` int DEFAULT NULL,
  `nombre_admin` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `contrasena_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_estado` (`id_estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado`
--

CREATE TABLE IF NOT EXISTS `estado` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo_estado` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grupos`
--

CREATE TABLE IF NOT EXISTS `grupos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `descripcion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_cambio_contrasena`
--

CREATE TABLE IF NOT EXISTS `historial_cambio_contrasena` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `fecha_cambio` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Disparadores `historial_cambio_contrasena`
--
DELIMITER $$
CREATE TRIGGER `log_cambio_contrasena` AFTER INSERT ON `historial_cambio_contrasena` FOR EACH ROW BEGIN
    INSERT INTO LOG_SEGURIDAD (usuario_id, timestamp, tipo_evento, descripcion)
    VALUES (NEW.id_usuario, NEW.fecha_cambio, 'Cambio de contraseña', 'El usuario cambió su contraseña.');
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_sesion_usuario`
--

CREATE TABLE IF NOT EXISTS `historial_sesion_usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `fecha_inicio_sesion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `direccion_ip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `dispositivo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Disparadores `historial_sesion_usuario`
--
DELIMITER $$
CREATE TRIGGER `log_inicio_sesion` AFTER INSERT ON `historial_sesion_usuario` FOR EACH ROW BEGIN
    INSERT INTO LOG_SEGURIDAD (usuario_id, timestamp, tipo_evento, descripcion)
    VALUES (NEW.usuario_id, NEW.fecha_inicio_sesion, 'Inicio de sesión', CONCAT('Inicio de sesión desde IP: ', NEW.direccion_ip));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `integrantes_grupo`
--

CREATE TABLE IF NOT EXISTS `integrantes_grupo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_grupo` int DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_grupo` (`id_grupo`),
  KEY `id_usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lista_blanca`
--

CREATE TABLE IF NOT EXISTS `lista_blanca` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `direccion_ip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lista_negra`
--

CREATE TABLE IF NOT EXISTS `lista_negra` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `direccion_ip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `log_seguridad`
--

CREATE TABLE IF NOT EXISTS `log_seguridad` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `horario` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tipo_evento` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `descripcion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos`
--

CREATE TABLE IF NOT EXISTS `permisos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(300) NOT NULL,
  `estado` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos_modulo`
--

CREATE TABLE IF NOT EXISTS `permisos_modulo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `modulo` int NOT NULL,
  `idPermiso` int NOT NULL,
  `estado` varchar(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idPermiso` (`idPermiso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos_usuario`
--

CREATE TABLE IF NOT EXISTS `permisos_usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idUsuario` int NOT NULL,
  `idPermiso` int NOT NULL,
  `estado` varchar(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idPermiso` (`idPermiso`),
  KEY `idUsuario` (`idUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `politica_seguridad`
--

CREATE TABLE IF NOT EXISTS `politica_seguridad` (
  `id` int NOT NULL AUTO_INCREMENT,
  `intentos_fallidos_permitidos` int NOT NULL,
  `tiempo_expiracion_sesion` int NOT NULL,
  `auteticacion_dos_factores` tinyint(1) NOT NULL,
  `intervalos_cambio_contrasena` timestamp(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pregunta_seguridad`
--

CREATE TABLE IF NOT EXISTS `pregunta_seguridad` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `pregunta` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `respuesta` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `estado` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuesta`
--

CREATE TABLE IF NOT EXISTS `respuesta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_pregunta` int DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  `respuesta` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_pregunta` (`id_pregunta`),
  KEY `id_usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE IF NOT EXISTS `rol` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `descripcion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitud_exportacion_datos`
--

CREATE TABLE IF NOT EXISTS `solicitud_exportacion_datos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `estado` varchar(10) NOT NULL DEFAULT 'enviada',
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `terminos_condiciones`
--

CREATE TABLE IF NOT EXISTS `terminos_condiciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `estado` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `descripcion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `terminos_contrasena`
--

CREATE TABLE IF NOT EXISTS `terminos_contrasena` (
  `id` int NOT NULL,
  `cant_caracteres` int NOT NULL,
  `cant_min_minusculas` int NOT NULL,
  `cant_min_mayusculas` int NOT NULL,
  `cant_min_numeros` int NOT NULL,
  `cant_min_caracteres_esp` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `token_invalidos`
--

CREATE TABLE IF NOT EXISTS `token_invalidos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(500) NOT NULL,
  `expiracion` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE IF NOT EXISTS `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_rol` int DEFAULT NULL,
  `id_estado` int DEFAULT NULL,
  `nombre_usuario` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `contrasena_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_rol` (`id_rol`),
  KEY `id_estado` (`id_estado`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `id_rol`, `id_estado`, `nombre_usuario`, `nombre`, `contrasena_hash`, `email`, `fecha_creacion`) VALUES
(1, NULL, NULL, 's', 'q', '2', '3@gmail.com', '2024-08-29 16:27:18'),
(2, NULL, NULL, 'jhoan', 'lindo', '$2b$10$ISB3/EwYK3.o/uhh73ze8etW/RwnAzXQx1bRWcKwnp1riUSRK5gHC', 'jhoan@gmail.com', '2024-08-29 16:27:37');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_rol`
--

CREATE TABLE IF NOT EXISTS `usuario_rol` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idusuario` int NOT NULL,
  `idRol` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idRol` (`idRol`),
  KEY `idusuario` (`idusuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `administrador`
--
ALTER TABLE `administrador`
  ADD CONSTRAINT `administrador_ibfk_1` FOREIGN KEY (`id_estado`) REFERENCES `estado` (`id`);

--
-- Filtros para la tabla `historial_cambio_contrasena`
--
ALTER TABLE `historial_cambio_contrasena`
  ADD CONSTRAINT `historial_cambio_contrasena_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `historial_sesion_usuario`
--
ALTER TABLE `historial_sesion_usuario`
  ADD CONSTRAINT `historial_sesion_usuario_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `integrantes_grupo`
--
ALTER TABLE `integrantes_grupo`
  ADD CONSTRAINT `integrantes_grupo_ibfk_1` FOREIGN KEY (`id_grupo`) REFERENCES `grupos` (`id`),
  ADD CONSTRAINT `integrantes_grupo_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `lista_blanca`
--
ALTER TABLE `lista_blanca`
  ADD CONSTRAINT `lista_blanca_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `historial_sesion_usuario` (`id`);

--
-- Filtros para la tabla `lista_negra`
--
ALTER TABLE `lista_negra`
  ADD CONSTRAINT `lista_negra_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `historial_sesion_usuario` (`id`);

--
-- Filtros para la tabla `log_seguridad`
--
ALTER TABLE `log_seguridad`
  ADD CONSTRAINT `log_seguridad_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `permisos_modulo`
--
ALTER TABLE `permisos_modulo`
  ADD CONSTRAINT `permisos_modulo_ibfk_1` FOREIGN KEY (`idPermiso`) REFERENCES `permisos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `permisos_usuario`
--
ALTER TABLE `permisos_usuario`
  ADD CONSTRAINT `permisos_usuario_ibfk_1` FOREIGN KEY (`idPermiso`) REFERENCES `permisos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permisos_usuario_ibfk_2` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `pregunta_seguridad`
--
ALTER TABLE `pregunta_seguridad`
  ADD CONSTRAINT `pregunta_seguridad_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `respuesta`
--
ALTER TABLE `respuesta`
  ADD CONSTRAINT `respuesta_ibfk_1` FOREIGN KEY (`id_pregunta`) REFERENCES `pregunta_seguridad` (`id`),
  ADD CONSTRAINT `respuesta_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `solicitud_exportacion_datos`
--
ALTER TABLE `solicitud_exportacion_datos`
  ADD CONSTRAINT `solicitud_exportacion_datos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id`),
  ADD CONSTRAINT `usuario_ibfk_2` FOREIGN KEY (`id_estado`) REFERENCES `estado` (`id`);

--
-- Filtros para la tabla `usuario_rol`
--
ALTER TABLE `usuario_rol`
  ADD CONSTRAINT `usuario_rol_ibfk_1` FOREIGN KEY (`idRol`) REFERENCES `rol` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usuario_rol_ibfk_2` FOREIGN KEY (`idusuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
