/* ====================================================================================
   ARCHIVO 00_setup.sql
   Script maestro para inicializar TODA la base de datos.
   Ejecuta automáticamente:
   - creación de tablas
   - inserciones iniciales
   - triggers
   - reportes (opcional)
   ==================================================================================== */

-- ============================================
-- 1. Crear tablas
-- ============================================
SOURCE 01_creacion_tablas.sql;

-- ============================================
-- 2. Insertar datos iniciales
-- ============================================
SOURCE 02_inserciones_iniciales.sql;

-- ============================================
-- 3. Crear triggers
-- ============================================
SOURCE 03_triggers.sql;

-- ============================================
-- 4. Reportes (solo consulta)
-- ============================================
-- SOURCE 04_reportes.sql;

