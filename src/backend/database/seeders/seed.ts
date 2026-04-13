/**
 * Seed Script - Maria Vita Database
 * Populates the database with initial test data
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Datos estructurados de los 16 médicos Mier y Terán
// Cada entrada es explícita — sin parseo dinámico de strings
// ---------------------------------------------------------------------------
const SPECIALISTS_DATA = [
  {
    email: 'juventino.gonzales@maria-vita.mx',
    suffix: 'Dr.',
    firstName: 'Juventino',
    lastName: 'Gonzales Herrera',
    phone: '+525511002001',
    dateOfBirth: new Date('1972-03-14'),
    specialty: 'Medicina General',
    licenseNumber: 'CEDMX-10001',
  },
  {
    email: 'miguel.espinoza@maria-vita.mx',
    suffix: 'Dr.',
    firstName: 'Miguel Angel',
    lastName: 'Espinoza Franklin',
    phone: '+525511002002',
    dateOfBirth: new Date('1975-07-22'),
    specialty: 'Cardiología',
    licenseNumber: 'CEDMX-10002',
  },
  {
    email: 'veronica.olvera@maria-vita.mx',
    suffix: 'Dra.',
    firstName: 'Verónica',
    lastName: 'Olvera Sumano',
    phone: '+525511002003',
    dateOfBirth: new Date('1980-11-05'),
    specialty: 'Ginecología y Obstetricia',
    licenseNumber: 'CEDMX-10003',
  },
  {
    email: 'arilda.velasquez@maria-vita.mx',
    suffix: 'Dra.',
    firstName: 'Arilda',
    lastName: 'Velásquez Ruiz',
    phone: '+525511002004',
    dateOfBirth: new Date('1978-04-18'),
    specialty: 'Pediatría',
    licenseNumber: 'CEDMX-10004',
  },
  {
    email: 'luis.barraza@maria-vita.mx',
    suffix: 'Dr.',
    firstName: 'Luis',
    lastName: 'Barraza Mendoza',
    phone: '+525511002005',
    dateOfBirth: new Date('1969-09-30'),
    specialty: 'Ortopedia y Traumatología',
    licenseNumber: 'CEDMX-10005',
  },
  {
    email: 'josue.angeles@maria-vita.mx',
    suffix: 'Dr.',
    firstName: 'Josué',
    lastName: 'Ángeles Castellanos',
    phone: '+525511002006',
    dateOfBirth: new Date('1983-01-27'),
    specialty: 'Neurología',
    licenseNumber: 'CEDMX-10006',
  },
  {
    email: 'abigail.juarez@maria-vita.mx',
    suffix: 'Dra.',
    firstName: 'Abigail',
    lastName: 'Juárez Cruz',
    phone: '+525511002007',
    dateOfBirth: new Date('1985-06-12'),
    specialty: 'Dermatología',
    licenseNumber: 'CEDMX-10007',
  },
  {
    email: 'erck.vasquez@maria-vita.mx',
    suffix: 'Dr.',
    firstName: 'Erck Orlando',
    lastName: 'Vásquez Cruz',
    phone: '+525511002008',
    dateOfBirth: new Date('1977-02-08'),
    specialty: 'Cirugía General',
    licenseNumber: 'CEDMX-10008',
  },
  {
    email: 'jesus.morales@maria-vita.mx',
    suffix: 'Dr.',
    firstName: 'Jesús Omar',
    lastName: 'Morales Ruiz',
    phone: '+525511002009',
    dateOfBirth: new Date('1974-08-19'),
    specialty: 'Urología',
    licenseNumber: 'CEDMX-10009',
  },
  {
    email: 'selena.salazar@maria-vita.mx',
    suffix: 'Dra.',
    firstName: 'Selena',
    lastName: 'Salazar Portillo',
    phone: '+525511002010',
    dateOfBirth: new Date('1982-12-03'),
    specialty: 'Endocrinología',
    licenseNumber: 'CEDMX-10010',
  },
  {
    email: 'uriel.martinez@maria-vita.mx',
    suffix: 'Dr.',
    firstName: 'Uriel',
    lastName: 'Martínez Cuevas',
    phone: '+525511002011',
    dateOfBirth: new Date('1971-05-25'),
    specialty: 'Oftalmología',
    licenseNumber: 'CEDMX-10011',
  },
  {
    email: 'apolonio.vasquez@maria-vita.mx',
    suffix: 'Dr.',
    firstName: 'Apolonio',
    lastName: 'Vásquez Ibarra',
    phone: '+525511002012',
    dateOfBirth: new Date('1968-10-11'),
    specialty: 'Reumatología',
    licenseNumber: 'CEDMX-10012',
  },
  {
    email: 'daniel.venegas@maria-vita.mx',
    suffix: 'Dr.',
    firstName: 'Daniel',
    lastName: 'Venegas Córdoba',
    phone: '+525511002013',
    dateOfBirth: new Date('1979-03-07'),
    specialty: 'Gastroenterología',
    licenseNumber: 'CEDMX-10013',
  },
  {
    email: 'sergio.lopez@maria-vita.mx',
    suffix: 'Dr.',
    firstName: 'Sergio',
    lastName: 'López Bernal',
    phone: '+525511002014',
    dateOfBirth: new Date('1976-07-14'),
    specialty: 'Neumología',
    licenseNumber: 'CEDMX-10014',
  },
  {
    email: 'abelardo.ramirez@maria-vita.mx',
    suffix: 'Dr.',
    firstName: 'Abelardo',
    lastName: 'Ramírez Dávila',
    phone: '+525511002015',
    dateOfBirth: new Date('1973-11-28'),
    specialty: 'Oncología Médica',
    licenseNumber: 'CEDMX-10015',
  },
  {
    email: 'ana.reyes@maria-vita.mx',
    suffix: 'Dra.',
    firstName: 'Ana',
    lastName: 'Reyes Montoya',
    phone: '+525511002016',
    dateOfBirth: new Date('1984-09-16'),
    specialty: 'Psiquiatría',
    licenseNumber: 'CEDMX-10016',
  },
] as const;

// ---------------------------------------------------------------------------

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
      console.error(
        '❌ Cannot connect to MySQL. Verify that MySQL is running on localhost:3306 and DATABASE_URL is correct.',
      );
      throw connectionError;
    }

    // ============================================
    // LIMPIAR DATOS ESPECÍFICOS DEL SEEDER
    // ============================================
    console.log('🔍 Checking existing data...');
    console.log('✅ Skipping global clean\n');

    // ============================================
    // USUARIOS — SUPERADMIN
    // ============================================
    console.log('👥 Synchronizing users...');

    const hashedSuperAdminPassword = await bcrypt.hash('Ajetreo1512!', 10);

    const superAdminUser = await prisma.user.upsert({
      where: { email: 'JESSE@ADMIN' },
      update: {
        passwordHash: hashedSuperAdminPassword,
        suffix: 'Lic.',
        firstName: 'Jesse',
        lastName: 'Ilescas Martinez',
        isActive: true,
        isNew: false,
      },
      create: {
        email: 'JESSE@ADMIN',
        passwordHash: hashedSuperAdminPassword,
        role: 'SUPERADMIN',
        suffix: 'Lic.',
        firstName: 'Jesse',
        lastName: 'Ilescas Martinez',
        dateOfBirth: new Date('1995-01-15'),
        phone: '5551234566',
        isActive: true,
        isNew: false,
      },
    });

    console.log('✅ Users synchronized');
    console.log(`   - Super Admin: ${superAdminUser.email}\n`);

    // ============================================
    // ESPECIALISTAS — MÉDICOS MIER Y TERÁN
    // ============================================
    console.log('👨‍⚕️ Synchronizing specialists...');

    const hashedDoctorPassword = await bcrypt.hash('ESPECIALISTA!', 10);

    for (const medico of SPECIALISTS_DATA) {
      const fullName = `${medico.firstName} ${medico.lastName}`;

      const specialistUser = await prisma.user.upsert({
        where: { email: medico.email },
        update: {
          passwordHash: hashedDoctorPassword,
          suffix: medico.suffix,
          firstName: medico.firstName,
          lastName: medico.lastName,
          phone: medico.phone,
          dateOfBirth: medico.dateOfBirth,
          isActive: true,
          isNew: false,
        },
        create: {
          email: medico.email,
          passwordHash: hashedDoctorPassword,
          role: 'SPECIALIST',
          suffix: medico.suffix,
          firstName: medico.firstName,
          lastName: medico.lastName,
          phone: medico.phone,
          dateOfBirth: medico.dateOfBirth,
          isActive: true,
          isNew: false,
        },
      });

      await prisma.specialist.upsert({
        where: { userId: specialistUser.id },
        update: {
          fullName: fullName,
          specialty: medico.specialty,
          licenseNumber: medico.licenseNumber,
          isAvailable: true,
        },
        create: {
          userId: specialistUser.id,
          fullName: fullName,
          specialty: medico.specialty,
          licenseNumber: medico.licenseNumber,
          isAvailable: true,
        },
      });

      console.log(`   ✓ ${medico.suffix} ${fullName} — ${medico.specialty}`);
    }

    console.log(`\n✅ ${SPECIALISTS_DATA.length} specialists synchronized\n`);

    // ============================================
    // RESUMEN
    // ============================================
    console.log('═══════════════════════════════════════');
    console.log('✅ Database seeding completed successfully!');
    console.log('═══════════════════════════════════════');
    console.log('\n📊 Summary:');
    console.log(`   - Total Users Synchronized: ${1 + SPECIALISTS_DATA.length}`);
    console.log(`   - Specialists: ${SPECIALISTS_DATA.length}`);
    console.log('\n🔑 Test credentials:');
    console.log('   ┌────────────────────────────────────────┐');
    console.log('   │ SUPER ADMINISTRADOR                    │');
    console.log('   ├────────────────────────────────────────┤');
    console.log('   │ Email: JESSE@ADMIN                     │');
    console.log('   │ Password: Ajetreo1512!                 │');
    console.log('   ├────────────────────────────────────────┤');
    console.log('   │ ESPECIALISTAS (16 médicos)             │');
    console.log('   ├────────────────────────────────────────┤');
    console.log('   │ Password: ESPECIALISTA!                │');
    console.log('   │ Emails: <nombre>.<apellido>@maria-vita.mx │');
    console.log('   └────────────────────────────────────────┘');
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
