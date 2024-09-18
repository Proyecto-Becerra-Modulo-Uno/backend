-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-09-2024 a las 02:49:49
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.0.28

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
CREATE DEFINER=`proyectobecerra`@`%` PROCEDURE `ACTUALIZAR_ESTADO` (IN `_MODULO` INT, IN `_PERMISO` INT)   BEGIN
    UPDATE permisos_modulo
    SET estado = IF(estado = 1, 0, 1)
    WHERE modulo = _MODULO AND idPermiso = _PERMISO;
END$$

CREATE DEFINER=`proyectobecerra`@`%` PROCEDURE `AsignarRolUsuario` (IN `p_usuario_id` INT, IN `p_rol_id` INT)   BEGIN
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

CREATE DEFINER=`proyectobecerra`@`%` PROCEDURE `ObtenerPanelControlUsuarios` ()   BEGIN
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

CREATE DEFINER=`proyectobecerra`@`%` PROCEDURE `SP_ACTUALIZAR_ESTADO_USUARIO` (IN `p_id` INT, IN `p_id_estado` INT)   BEGIN
    UPDATE usuario 
    SET id_estado = p_id_estado
    WHERE id = p_id;
END$$

CREATE DEFINER=`proyectobecerra`@`%` PROCEDURE `SP_ACTUALIZAR_POLITICA` (IN `p_longitud_minima_contrasena` INT, IN `p_duracion_token` VARCHAR(50), IN `p_frecuencia_copia_seguridad` VARCHAR(50))   BEGIN
    UPDATE politica_seguridad
    SET longitud_minima_contrasena = p_longitud_minima_contrasena,
        duracion_token = p_duracion_token,
        frecuencia_copia_seguridad = p_frecuencia_copia_seguridad
    WHERE id = 1; -- Puedes cambiar este ID según sea necesario
END$$

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

CREATE DEFINER=`proyectobecerra`@`%` PROCEDURE `SP_DURACION_TOKEN` (IN `new_duracion_token` VARCHAR(255))   BEGIN
    UPDATE politica_seguridad p
    SET duracion_token = new_duracion_token
    WHERE p.id = 1;
END$$

CREATE DEFINER=`proyectobecerra`@`%` PROCEDURE `SP_INSERTAR_HISTORIAL_SESION_USUARIO` (IN `p_usuario_id` INT, IN `p_direccion_ip` VARCHAR(45), IN `p_dispositivo` VARCHAR(255))   BEGIN
    INSERT INTO historial_sesion_usuario(
        usuario_id, 
        direccion_ip, 
        dispositivo
    ) 
    VALUES (
        p_usuario_id, 
        p_direccion_ip, 
        p_dispositivo
    );
END$$

CREATE DEFINER=`proyectobecerra`@`%` PROCEDURE `SP_LISTAR_POLI` ()   BEGIN
    SELECT * FROM politica_seguridad WHERE 1;
END$$

CREATE DEFINER=`proyectobecerra`@`%` PROCEDURE `SP_LISTAR_REGISTROS` ()   BEGIN
    SELECT * FROM historial_sesion_usuario;
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_OBTENER_MODULOS_Y_PERMISOS` ()   BEGIN
    SELECT 
        m.id AS modulo_id,
        m.nombre AS modulo_nombre,
        m.estado AS modulo_estado,
        p.id AS permiso_id,
        p.nombre AS permiso_nombre,
        p.estado AS permiso_estado,
        mp.estado AS relacion_estado
    FROM 
        modulos m
    LEFT JOIN 
        permisos_modulo mp ON m.id = mp.modulo
    LEFT JOIN 
        permisos p ON p.id = mp.idPermiso;
END$$

CREATE DEFINER=`proyectobecerra`@`%` PROCEDURE `SP_VerificarRoles` (IN `_nombre` VARCHAR(255))   BEGIN
   SELECT u.id_rol, u.nombre_usuario, u.nombre, u.email, u.contrasena_hash FROM usuario u WHERE u.nombre_usuario = _nombre;
END$$

CREATE DEFINER=`proyectobecerra`@`%` PROCEDURE `SP_VerificarUsuario` (IN `_nombre_usuario` VARCHAR(255))   BEGIN
    SELECT nombre_usuario FROM usuario WHERE nombre_usuario = _nombre_usuario;
END$$

CREATE DEFINER=`proyectobecerra`@`%` PROCEDURE `UpdateVerificationDouble` (IN `p_id_admin` INT, IN `p_estado_v` VARCHAR(20))   BEGIN
    UPDATE verificacion_doble
    SET estado_v = p_estado_v
    WHERE id_admin = p_id_admin;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administrador`
--

CREATE TABLE `administrador` (
  `id` int(11) NOT NULL,
  `id_estado` int(11) DEFAULT NULL,
  `nombre_admin` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `contrasena_hash` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telefono` varchar(100) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `administrador`
--

INSERT INTO `administrador` (`id`, `id_estado`, `nombre_admin`, `nombre`, `contrasena_hash`, `email`, `telefono`, `fecha_creacion`) VALUES
(2, NULL, 'prueba', 'prueba', '1', 'leonardo.franco.tangarife@gmail.com', '3226347434', '2024-09-04 23:53:16'),
(3, NULL, 'dios mio', 'a', '1', 'asdfasdf@gmail.com', '21654', '2024-09-05 04:51:34'),
(5, NULL, 'prueba2', 'prueba2', '1', 'leo@gmail.com', '3226347434', '2024-09-05 20:32:59'),
(6, NULL, 'prueba2', 'prueba2', '1', 'leo@gmail.com', '3226347434', '2024-09-05 20:32:59');

--
-- Disparadores `administrador`
--
DELIMITER $$
CREATE TRIGGER `creacion_doble_verificacion` AFTER INSERT ON `administrador` FOR EACH ROW BEGIN
    INSERT INTO verificacion_doble (id_admin, estado_v)
    VALUES (NEW.id, 2);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado`
--

CREATE TABLE `estado` (
  `id` int(11) NOT NULL,
  `tipo_estado` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_verificacion_doble`
--

CREATE TABLE `estado_verificacion_doble` (
  `id` int(11) NOT NULL,
  `estado` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado_verificacion_doble`
--

INSERT INTO `estado_verificacion_doble` (`id`, `estado`) VALUES
(1, 'activado'),
(2, 'desactivado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grupos`
--

CREATE TABLE `grupos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_cambio_contrasena`
--

CREATE TABLE `historial_cambio_contrasena` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `fecha_cambio` timestamp NOT NULL DEFAULT current_timestamp()
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

CREATE TABLE `historial_sesion_usuario` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `fecha_inicio_sesion` timestamp NOT NULL DEFAULT current_timestamp(),
  `direccion_ip` varchar(255) DEFAULT NULL,
  `dispositivo` varchar(255) DEFAULT NULL
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

CREATE TABLE `integrantes_grupo` (
  `id` int(11) NOT NULL,
  `id_grupo` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lista_blanca`
--

CREATE TABLE `lista_blanca` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `direccion_ip` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lista_negra`
--

CREATE TABLE `lista_negra` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `direccion_ip` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `log_seguridad`
--

CREATE TABLE `log_seguridad` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `horario` timestamp NOT NULL DEFAULT current_timestamp(),
  `tipo_evento` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modulos`
--

CREATE TABLE `modulos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(25) NOT NULL,
  `estado` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `modulos`
--

INSERT INTO `modulos` (`id`, `nombre`, `estado`) VALUES
(1, 'Ajustes', ''),
(2, 'Usuarios', ''),
(3, 'Grupos', ''),
(4, 'Informes', ''),
(5, 'Accesos', ''),
(6, 'Exportar Datos', ''),
(7, 'Administración', ''),
(8, 'Configuración', ''),
(9, 'Registros', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos`
--

CREATE TABLE `permisos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(300) NOT NULL,
  `estado` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `permisos`
--

INSERT INTO `permisos` (`id`, `nombre`, `estado`) VALUES
(1, 'Visualizar', ''),
(2, 'Editar', ''),
(3, 'Eliminar', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos_modulo`
--

CREATE TABLE `permisos_modulo` (
  `id` int(11) NOT NULL,
  `modulo` int(11) NOT NULL,
  `idPermiso` int(11) NOT NULL,
  `estado` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `permisos_modulo`
--

INSERT INTO `permisos_modulo` (`id`, `modulo`, `idPermiso`, `estado`) VALUES
(1, 7, 2, 'Activo'),
(2, 5, 2, 'Activo'),
(3, 4, 1, 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos_usuario`
--

CREATE TABLE `permisos_usuario` (
  `id` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `idPermiso` int(11) NOT NULL,
  `estado` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `politica_seguridad`
--

CREATE TABLE `politica_seguridad` (
  `id` int(11) NOT NULL,
  `intentos_fallidos_permitidos` int(11) NOT NULL,
  `duracion_token` varchar(50) NOT NULL,
  `tiempo_expiracion_sesion` int(11) NOT NULL,
  `auteticacion_dos_factores` tinyint(1) NOT NULL,
  `intervalos_cambio_contrasena` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pregunta_seguridad`
--

CREATE TABLE `pregunta_seguridad` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `pregunta` varchar(255) NOT NULL,
  `respuesta` varchar(300) NOT NULL,
  `estado` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuesta`
--

CREATE TABLE `respuesta` (
  `id` int(11) NOT NULL,
  `id_pregunta` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `respuesta` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitud_exportacion_datos`
--

CREATE TABLE `solicitud_exportacion_datos` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `estado` varchar(10) NOT NULL DEFAULT 'enviada'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `terminos_condiciones`
--

CREATE TABLE `terminos_condiciones` (
  `id` int(11) NOT NULL,
  `estado` varchar(10) NOT NULL,
  `descripcion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `terminos_contrasena`
--

CREATE TABLE `terminos_contrasena` (
  `id` int(11) NOT NULL,
  `cant_caracteres` int(11) NOT NULL,
  `cant_min_minusculas` int(11) NOT NULL,
  `cant_min_mayusculas` int(11) NOT NULL,
  `cant_min_numeros` int(11) NOT NULL,
  `cant_min_caracteres_esp` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `token_invalidos`
--

CREATE TABLE `token_invalidos` (
  `id` int(11) NOT NULL,
  `token` varchar(500) NOT NULL,
  `expiracion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `id_rol` int(11) DEFAULT NULL,
  `id_estado` int(11) DEFAULT NULL,
  `nombre_usuario` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `contrasena_hash` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `id_rol`, `id_estado`, `nombre_usuario`, `nombre`, `contrasena_hash`, `email`, `fecha_creacion`) VALUES
(1, NULL, NULL, 's', 'q', '2', '3@gmail.com', '2024-08-29 21:27:18'),
(2, NULL, NULL, 'jhoan', 'lindo', '$2b$10$ISB3/EwYK3.o/uhh73ze8etW/RwnAzXQx1bRWcKwnp1riUSRK5gHC', 'jhoan@gmail.com', '2024-08-29 21:27:37'),
(3, NULL, NULL, 'exxney', 'exneyder', '$2b$10$eY296e04Z4FWS6npmWmxl.1TQj1jZbUjMLaGhoxftgsvoIjLSiqzW', 'asdfaf@gmail.com', '2024-09-04 17:17:48');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_rol`
--

CREATE TABLE `usuario_rol` (
  `id` int(11) NOT NULL,
  `idusuario` int(11) NOT NULL,
  `idRol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `verificacion_doble`
--

CREATE TABLE `verificacion_doble` (
  `id` int(11) NOT NULL,
  `id_admin` int(11) NOT NULL,
  `estado_v` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `verificacion_doble`
--

INSERT INTO `verificacion_doble` (`id`, `id_admin`, `estado_v`) VALUES
(3, 5, 1),
(4, 6, 2),
(3, 5, 1),
(4, 6, 2),
(3, 5, 1),
(4, 6, 2),
(3, 5, 1),
(4, 6, 2),
(3, 5, 1),
(4, 6, 2),
(3, 5, 1),
(4, 6, 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `administrador`
--
ALTER TABLE `administrador`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_estado` (`id_estado`);

--
-- Indices de la tabla `estado`
--
ALTER TABLE `estado`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `estado_verificacion_doble`
--
ALTER TABLE `estado_verificacion_doble`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `grupos`
--
ALTER TABLE `grupos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `historial_cambio_contrasena`
--
ALTER TABLE `historial_cambio_contrasena`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `historial_sesion_usuario`
--
ALTER TABLE `historial_sesion_usuario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `integrantes_grupo`
--
ALTER TABLE `integrantes_grupo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_grupo` (`id_grupo`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `lista_blanca`
--
ALTER TABLE `lista_blanca`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `lista_negra`
--
ALTER TABLE `lista_negra`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `log_seguridad`
--
ALTER TABLE `log_seguridad`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `modulos`
--
ALTER TABLE `modulos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `permisos`
--
ALTER TABLE `permisos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `permisos_modulo`
--
ALTER TABLE `permisos_modulo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idPermiso` (`idPermiso`) USING BTREE,
  ADD KEY `fk_modulo_modulos` (`modulo`);

--
-- Indices de la tabla `permisos_usuario`
--
ALTER TABLE `permisos_usuario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idPermiso` (`idPermiso`),
  ADD KEY `idUsuario` (`idUsuario`);

--
-- Indices de la tabla `politica_seguridad`
--
ALTER TABLE `politica_seguridad`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pregunta_seguridad`
--
ALTER TABLE `pregunta_seguridad`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `respuesta`
--
ALTER TABLE `respuesta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pregunta` (`id_pregunta`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `solicitud_exportacion_datos`
--
ALTER TABLE `solicitud_exportacion_datos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `terminos_condiciones`
--
ALTER TABLE `terminos_condiciones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `token_invalidos`
--
ALTER TABLE `token_invalidos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_rol` (`id_rol`),
  ADD KEY `id_estado` (`id_estado`);

--
-- Indices de la tabla `usuario_rol`
--
ALTER TABLE `usuario_rol`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idRol` (`idRol`),
  ADD KEY `idusuario` (`idusuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `administrador`
--
ALTER TABLE `administrador`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `lista_blanca`
--
ALTER TABLE `lista_blanca`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `permisos_modulo`
--
ALTER TABLE `permisos_modulo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `terminos_condiciones`
--
ALTER TABLE `terminos_condiciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `lista_blanca`
--
ALTER TABLE `lista_blanca`
  ADD CONSTRAINT `lista_blanca_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `historial_sesion_usuario` (`id`);

--
-- Filtros para la tabla `permisos_modulo`
--
ALTER TABLE `permisos_modulo`
  ADD CONSTRAINT `fk_idPermiso_permisos` FOREIGN KEY (`idPermiso`) REFERENCES `permisos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_modulo_modulos` FOREIGN KEY (`modulo`) REFERENCES `modulos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id`),
  ADD CONSTRAINT `usuario_ibfk_2` FOREIGN KEY (`id_estado`) REFERENCES `estado` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
