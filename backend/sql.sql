-- AUN EN PROCESO DE MODIFICAICON

CREATE TABLE Productos
(

    id INTEGER NOT NULL,

    nombre VARCHAR(20) NOT NULL,

    apellido VARCHAR(20) NOT NULL,

    tipo_doc VARCHAR(20) NOT NULL,

    num_doc INTEGER NOT NULL,

    categoria VARCHAR(20),

    cod_ofic INTEGER NOT NULL,

    CONSTRAINT emp_pk_cod_emp PRIMARY KEY (id),

    CONSTRAINT emp_ck_cod_emp CHECK (cod_emp >= 100 AND cod_emp <=1000),

    CONSTRAINT emp_uk_tipo_doc UNIQUE (tipo_doc),

    CONSTRAINT emp_uk_num_doc UNIQUE (num_doc),

    CONSTRAINT emp_ck_categoria CHECK (categoria = 'Senior' OR categoria = 'Semi Senior' OR categoria = 'Junior')

);


CREATE TABLE Usuarios
(

    id INTEGER NOT NULL,

    nombre VARCHAR(20) NOT NULL,

    email VARCHAR(254) NOT NULL,

    activo BOOLEAN DEFAULT TRUE NOT NULL,

    CONSTRAINT usr_pk_id_usr PRIMARY KEY (id),

    CONSTRAINT usr_uk_tipo_doc UNIQUE (id),

    CONSTRAINT usr_uk_num_doc UNIQUE (num_doc),

    CONSTRAINT usr_ck_categoria CHECK (categoria = 'Senior' OR categoria = 'Semi Senior' OR categoria = 'Junior')

); 

CREATE TABLE Auth
(

    id INTEGER NOT NULL,

    -- le paso el email
    usuario VARCHAR(20) NOT NULL,

    -- es 100 el max para almacenar encriptado
    contrasena VARCHAR(100) NOT NULL,

    CONSTRAINT usr_pk_id_usr PRIMARY KEY (id),

    CONSTRAINT usr_uk_tipo_doc UNIQUE (id),

    CONSTRAINT usr_uk_num_doc UNIQUE (num_doc),

    CONSTRAINT usr_ck_categoria CHECK (categoria = 'Senior' OR categoria = 'Semi Senior' OR categoria = 'Junior')

); 
