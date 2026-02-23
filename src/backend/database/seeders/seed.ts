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
    // LIMPIAR DATOS EXISTENTES
    // ============================================
    console.log('🧹 Cleaning existing data...');
    await prisma.studyRequest.deleteMany();
    await prisma.appointment.deleteMany();
    await prisma.availability.deleteMany();
    await prisma.specialist.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ Data cleaned\n');

    // ============================================
    // USUARIOS
    // ============================================
    console.log('👥 Creating users...');

    // Contraseñas para diferentes usuarios
    const superAdminPassword = 'Ajetreo1512!';
    const doctorPassword = 'Doctor2026!';

    const hashedSuperAdminPassword = await bcrypt.hash(superAdminPassword, 10);
    const hashedDoctorPassword = await bcrypt.hash(doctorPassword, 10);

    // Super Administrador - Jesse
    const superAdminUser = await prisma.user.create({
      data: {
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

    console.log('✅ Users created');
    console.log(`   - Super Admin: ${superAdminUser.email}\n`);

    // ============================================
    // ESPECIALISTAS - MÉDICOS REALES MIER Y TERÁN
    // ============================================
    console.log('👨‍⚕️ Creating specialists...');

    // Datos reales de médicos
    const medicosData = [
      { name: 'DR. JUVENTINO GONZALES', specialty: 'CIRUJANO UROLOGO CERTIFICADO', office: 'Consultorio 101' },
      { name: 'DR. MIGUEL ANGEL ESPINOZA FRANKLIN', specialty: 'TRAUMATOLOGIA Y ORTOPEDIA', office: 'Consultorio 102' },
      { name: 'DR. VERONICA OLVERA SUMANO', specialty: 'GENETISTA PATOLOGIA HEREDITARIA', office: 'Consultorio 103' },
      { name: 'DR. ARILDA VELASQUEZ RUIZ', specialty: 'CLINICA DEL DOLOR Y TANATOLOGIA', office: 'Consultorio 104' },
      { name: 'DR. LUIS BARRAZA', specialty: 'GERIATRA', office: 'Consultorio 105' },
      { name: 'DR. JOSUE ANGELES', specialty: 'CARDIOLOGO INTERVENCIONISTA', office: 'Consultorio 106' },
      { name: 'DR. ABIGAIL JUAREZ CRUZ', specialty: 'INFECTOLOGA INTERNISTA', office: 'Consultorio 107' },
      { name: 'DR. ERCK ORLANDO VASQUEZ CRUZ', specialty: 'CIRUGIA GENERAL', office: 'Consultorio 108' },
      { name: 'DR. JESUS OMAR MORALES RUIZ', specialty: 'INTENSIVISTA PEDIATRA', office: 'Consultorio 109' },
      { name: 'DRA. SELENA SALAZAR', specialty: 'NEUMOLOGIA PARA ADULTOS', office: 'Consultorio 110' },
      { name: 'DR. URIEL MARTINEZ CUEVAS', specialty: 'OTORRINOLARINGOLOGO', office: 'Consultorio 111' },
      { name: 'DR. APOLONIO VASQUEZ', specialty: 'MEDICO GENERAL', office: 'Consultorio 112' },
      { name: 'DR. DANIEL VENEGAS CORDOBA', specialty: 'MEDICO FAMILIAR', office: 'Consultorio 113' },
      { name: 'DR. SERGIO LOPEZ BERNAL', specialty: 'MEDICO IMAGENOLOGO', office: 'Sala de Imagen' },
      { name: 'DR. ABELARDO RAMIREZ DAVILA', specialty: 'NORMATIVIDAD Y COFEPRIS', office: 'Oficina Administrativa' },
      { name: 'DRA. ANA', specialty: 'URGENCIOLOGA', office: 'Sala de Urgencias' },
    ];

    const specialists = [];

    for (let i = 0; i < medicosData.length; i++) {
      const medico = medicosData[i]!; // TypeScript non-null assertion
      const nameParts = medico.name.trim().split(/\s+/);
      const hasTitle = /^DRA?\.?$/i.test(nameParts[0] || '');
      const suffix = hasTitle ? nameParts[0]!.toUpperCase().replace(/\.$/, '') + '.' : 'Dr.';
      const cleanNameParts = hasTitle ? nameParts.slice(1) : nameParts;
      const firstName = cleanNameParts.slice(0, 2).join(' ') || 'ESPECIALISTA';
      const lastName = cleanNameParts.slice(2).join(' ') || 'ESPECIALISTA';
      const fullName = `${firstName} ${lastName}`.trim();

      // Generar email único basado en el nombre
      const emailName = fullName
        .toLowerCase()
        .replace(/\bdr\.?\b|\bdra\.?\b/gi, '')
        .trim()
        .split(' ')
        .join('.');

      // Generar fecha de nacimiento aleatoria entre 1960-1985
      const birthYear = 1960 + Math.floor(i * 1.5);
      const birthMonth = (i % 12) + 1;
      const birthDay = ((i * 7) % 28) + 1;

      const specialistUser = await prisma.user.create({
        data: {
          email: `${emailName}@maria-vita.mx`,
          passwordHash: hashedDoctorPassword,
          role: 'SPECIALIST',
          suffix: suffix,
          firstName: firstName,
          lastName: lastName,
          dateOfBirth: new Date(birthYear, birthMonth - 1, birthDay),
          phone: `555${(1234571 + i).toString()}`,
          isActive: true,
          isNew: true, // Debe completar perfil
        },
      });

      const specialist = await prisma.specialist.create({
        data: {
          userId: specialistUser.id,
          fullName,
          specialty: medico.specialty,
          licenseNumber: `LIC-MV-${String(i + 1).padStart(3, '0')}`,
          assignedOffice: medico.office,
          consultationFee: medico.specialty.includes('GENERAL') || medico.specialty.includes('FAMILIAR') ? 800.0 :
            medico.specialty.includes('CIRUGIA') || medico.specialty.includes('CARDIO') ? 2500.0 :
              medico.specialty.includes('IMAGEN') || medico.specialty.includes('RADIO') ? 2000.0 : 1500.0,
          biography: `Especialista en ${medico.specialty}`,
          yearsOfExperience: 5 + Math.floor(i * 1.2),
          isAvailable: true,
        },
      });

      specialists.push(specialist);
    }

    console.log(`✅ ${specialists.length} specialists created\n`);

    // ============================================
    // RESUMEN
    // ============================================
    console.log('═══════════════════════════════════════');
    console.log('✅ Database seeding completed successfully!');
    console.log('═══════════════════════════════════════');
    console.log('\n📊 Summary:');
    console.log(`   - Total Users: ${1 + specialists.length} (1 SUPERADMIN + ${specialists.length} specialists)`);
    console.log(`   - Specialists: ${specialists.length}`);
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
    console.log('   │ Password: Doctor2026!                  │');
    console.log('   │ Deben completar perfil al iniciar      │');
    console.log('   └────────────────────────────────────────┘');
    console.log('\n💊 16 Médicos Especialistas Mier y Terán creados');
    console.log('   - Todos incluyen: Sufijo, Nombre, Apellidos, Fecha de Nacimiento');
    console.log('   - Urología, Traumatología, Genética');
    console.log('   - Cardiología, Neumología, Pediatría');
    console.log('   - Medicina General, Imagenología, y más...\n');
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
