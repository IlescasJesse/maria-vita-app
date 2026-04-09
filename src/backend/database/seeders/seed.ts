/**
 * Seed Script - Maria Vita Database
 * Populates the database with initial test data
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // ============================================
    // VERIFICAR CONEXIÓN A BASE DE DATOS
    // ============================================
    try {
      await prisma.$connect();
      console.log('🔌 Database connection established\n');
    } catch (connectionError: any) {
      console.error('❌ Cannot connect to MySQL. Verify that MySQL is running on localhost:3306 and DATABASE_URL is correct.');
      throw connectionError;
    }

    // ============================================
    // LIMPIAR DATOS ESPECÍFICOS DEL SEEDER (OPCIONAL)
    // ============================================
    console.log('🔍 Checking existing data...');
    // Ya no se borran todos los registros (studyRequest, appointment, availability, etc.)
    // para mantener la integridad de los datos existentes.
    console.log('✅ Skipping global clean\n');

    // ============================================
    // USUARIOS
    // ============================================
    console.log('👥 Synchronizing users...');

    // Contraseñas para diferentes usuarios
    const superAdminPassword = 'Ajetreo1512!';
    const doctorPassword = 'ESPECIALISTA!';

    const hashedSuperAdminPassword = await bcrypt.hash(superAdminPassword, 10);
    const hashedDoctorPassword = await bcrypt.hash(doctorPassword, 10);

    // Super Administrador - Jesse
    const superAdminUser = await prisma.user.upsert({
      where: { email: 'JESSE@ADMIN' },
      update: {
        passwordHash: hashedSuperAdminPassword,
        suffix: 'Lic.',
        firstName: 'JESSE',
        lastName: 'ILESCAS MARTINEZ',
      },
      create: {
        email: 'JESSE@ADMIN',
        passwordHash: hashedSuperAdminPassword,
        role: 'SUPERADMIN',
        suffix: 'Lic.',
        firstName: 'JESSE',
        lastName: 'ILESCAS MARTINEZ',
        dateOfBirth: new Date('1995-01-15'),
        phone: '5551234566',
        isActive: true,
        isNew: false,
      },
    });

    console.log('✅ Users synchronized');
    console.log(`   - Super Admin: ${superAdminUser.email}\n`);

    // ============================================
    // ESPECIALISTAS - MÉDICOS REALES MIER Y TERÁN
    // ============================================
    console.log('👨‍⚕️ Synchronizing specialists...');

    // Datos reales de médicos simplificados
    const medicosData = [
      'DR. JUVENTINO GONZALES',
      'DR. MIGUEL ANGEL ESPINOZA FRANKLIN',
      'DR. VERONICA OLVERA SUMANO',
      'DR. ARILDA VELASQUEZ RUIZ',
      'DR. LUIS BARRAZA',
      'DR. JOSUE ANGELES',
      'DR. ABIGAIL JUAREZ CRUZ',
      'DR. ERCK ORLANDO VASQUEZ CRUZ',
      'DR. JESUS OMAR MORALES RUIZ',
      'DRA. SELENA SALAZAR',
      'DR. URIEL MARTINEZ CUEVAS',
      'DR. APOLONIO VASQUEZ',
      'DR. DANIEL VENEGAS CORDOBA',
      'DR. SERGIO LOPEZ BERNAL',
      'DR. ABELARDO RAMIREZ DAVILA',
      'DRA. ANA',
    ];

    const specialistsCount = [];

    for (let i = 0; i < medicosData.length; i++) {
      const medicoName = medicosData[i]!;
      const nameParts = medicoName.trim().split(/\s+/);
      const hasTitle = /^DRA?\.?$/i.test(nameParts[0] || '');
      const suffix = hasTitle ? nameParts[0]!.toUpperCase().replace(/\.$/, '') + '.' : 'Dr.';
      const cleanNameParts = hasTitle ? nameParts.slice(1) : nameParts;
      const firstName = cleanNameParts.slice(0, 2).join(' ') || 'ESPECIALISTA';
      const lastName = cleanNameParts.slice(2).join(' ') || 'ESPECIALISTA';
      const fullName = `${firstName} ${lastName}`.trim();

      const email = `${fullName.toLowerCase().split(' ').join('.')}@maria-vita.mx`;

      const specialistUser = await prisma.user.upsert({
        where: { email: email },
        update: {
          suffix: suffix,
          firstName: firstName,
          lastName: lastName,
        },
        create: {
          email: email,
          passwordHash: hashedDoctorPassword,
          role: 'SPECIALIST',
          suffix: suffix,
          firstName: firstName,
          lastName: lastName,
          isActive: true,
          isNew: true,
        },
      });

      await prisma.specialist.upsert({
        where: { userId: specialistUser.id },
        update: {
          fullName: fullName,
        },
        create: {
          userId: specialistUser.id,
          fullName: fullName,
          specialty: 'Especialista',
          licenseNumber: `LIC-MV-${String(i + 1).padStart(3, '0')}`,
          isAvailable: true,
        },
      });

      specialistsCount.push(specialistUser);
    }

    console.log(`✅ ${specialistsCount.length} specialists synchronized\n`);

    // ============================================
    // RESUMEN
    // ============================================
    console.log('═══════════════════════════════════════');
    console.log('✅ Database seeding completed successfully!');
    console.log('═══════════════════════════════════════');
    console.log('\n📊 Summary:');
    console.log(`   - Total Users Synchronized: ${1 + specialistsCount.length}`);
    console.log(`   - Specialists: ${specialistsCount.length}`);
    console.log('\n🔑 Test credentials:');
    console.log('   ┌────────────────────────────────────────┐');
    console.log('   │ SUPER ADMINISTRADOR                    │');
    console.log('   ├────────────────────────────────────────┤');
    console.log('   │ Email: JESSE@ADMIN                     │');
    console.log('   │ Password: Ajetreo1512!                 │');
    console.log('   ├────────────────────────────────────────┤');
    console.log('   │ ESPECIALISTAS                          │');
    console.log('   ├────────────────────────────────────────┤');
    console.log('   │ 16 Médicos Mier y Terán                │');
    console.log('   │ Todos comparten contraseña             │');
    console.log('   │ Password: ESPECIALISTA!                │');
    console.log('   │ Deben completar perfil al iniciar      │');
    console.log('   └────────────────────────────────────────┘');
    console.log('\n💊 16 Médicos Especialistas Mier y Terán creados');
    console.log('   - Solo información básica: Sufijo, Nombre, Email');
    console.log('\n');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
