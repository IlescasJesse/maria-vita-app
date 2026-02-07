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
    const adminPassword = 'Admin2026!';
    const doctorPassword = 'Doctor2026!';
    const patientPassword = 'Patient2026!';
    const testPassword1 = 'Usuario1Test!';
    const testPassword2 = 'Usuario2Test!';
    
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
    const hashedDoctorPassword = await bcrypt.hash(doctorPassword, 10);
    const hashedPatientPassword = await bcrypt.hash(patientPassword, 10);
    const hashedTestPassword1 = await bcrypt.hash(testPassword1, 10);
    const hashedTestPassword2 = await bcrypt.hash(testPassword2, 10);

    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@mariavita.com',
        passwordHash: hashedAdminPassword,
        role: 'ADMIN',
        firstName: 'Admin',
        lastName: 'Sistema',
        phone: '5551234567',
        isActive: true,
      },
    });

    const doctorUser = await prisma.user.create({
      data: {
        email: 'doctor@mariavita.com',
        passwordHash: hashedDoctorPassword,
        role: 'SPECIALIST',
        firstName: 'Dr. Juan',
        lastName: 'Pérez',
        phone: '5551234568',
        isActive: true,
      },
    });

    const patientUser1 = await prisma.user.create({
      data: {
        email: 'paciente1@example.com',
        passwordHash: hashedPatientPassword,
        role: 'PATIENT',
        firstName: 'María',
        lastName: 'García',
        phone: '5551234569',
        isActive: true,
      },
    });

    const patientUser2 = await prisma.user.create({
      data: {
        email: 'paciente2@example.com',
        passwordHash: hashedPatientPassword,
        role: 'PATIENT',
        firstName: 'Carlos',
        lastName: 'López',
        phone: '5551234570',
        isActive: true,
      },
    });
    
    // Usuarios de prueba adicionales
    const testUser1 = await prisma.user.create({
      data: {
        email: 'prueba1@mariavita.com',
        passwordHash: hashedTestPassword1,
        role: 'PATIENT',
        firstName: 'Usuario',
        lastName: 'Prueba Uno',
        phone: '5559871234',
        isActive: true,
      },
    });
    
    const testUser2 = await prisma.user.create({
      data: {
        email: 'prueba2@mariavita.com',
        passwordHash: hashedTestPassword2,
        role: 'PATIENT',
        firstName: 'Usuario',
        lastName: 'Prueba Dos',
        phone: '5559875678',
        isActive: true,
      },
    });

    console.log('✅ Users created');
    console.log(`   - Admin: ${adminUser.email}`);
    console.log(`   - Doctor: ${doctorUser.email}`);
    console.log(`   - Patient 1: ${patientUser1.email}`);
    console.log(`   - Patient 2: ${patientUser2.email}`);
    console.log(`   - Test User 1: ${testUser1.email}`);
    console.log(`   - Test User 2: ${testUser2.email}\n`);

    // ============================================
    // ESPECIALISTAS
    // ============================================
    console.log('👨‍⚕️ Creating specialists...');

    const specialist1 = await prisma.specialist.create({
      data: {
        userId: doctorUser.id,
        fullName: 'Dr. Juan Pérez',
        specialty: 'Cardiología',
        licenseNumber: 'LIC-CARD-001',
        assignedOffice: 'Consultorio 101',
        consultationFee: 1500.0,
        biography: 'Especialista en cardiología con 15 años de experiencia',
        yearsOfExperience: 15,
        isAvailable: true,
      },
    });

    // Crear especialistas adicionales con usuarios asociados
    const user2 = await prisma.user.create({
      data: {
        email: 'radiologo@mariavita.com',
        passwordHash: hashedDoctorPassword,
        role: 'SPECIALIST',
        firstName: 'Dra. Ana',
        lastName: 'Martínez',
        phone: '5551234571',
        isActive: true,
      },
    });

    const specialist2 = await prisma.specialist.create({
      data: {
        userId: user2.id,
        fullName: 'Dra. Ana Martínez',
        specialty: 'Radiología',
        licenseNumber: 'LIC-RAD-001',
        assignedOffice: 'Sala de Imagen',
        consultationFee: 2000.0,
        biography: 'Radióloga certificada especializada en diagnóstico por imagen',
        yearsOfExperience: 10,
        isAvailable: true,
      },
    });

    const user3 = await prisma.user.create({
      data: {
        email: 'general@mariavita.com',
        passwordHash: hashedDoctorPassword,
        role: 'SPECIALIST',
        firstName: 'Dr. Pedro',
        lastName: 'González',
        phone: '5551234572',
        isActive: true,
      },
    });

    const specialist3 = await prisma.specialist.create({
      data: {
        userId: user3.id,
        fullName: 'Dr. Pedro González',
        specialty: 'Medicina General',
        licenseNumber: 'LIC-GP-001',
        assignedOffice: 'Consultorio 102',
        consultationFee: 800.0,
        biography: 'Médico general con amplia experiencia en consulta primaria',
        yearsOfExperience: 8,
        isAvailable: true,
      },
    });

    const user4 = await prisma.user.create({
      data: {
        email: 'neurologo@mariavita.com',
        passwordHash: hashedDoctorPassword,
        role: 'SPECIALIST',
        firstName: 'Dr. Miguel',
        lastName: 'Rodríguez',
        phone: '5551234573',
        isActive: true,
      },
    });

    await prisma.specialist.create({
      data: {
        userId: user4.id,
        fullName: 'Dr. Miguel Rodríguez',
        specialty: 'Neurología',
        licenseNumber: 'LIC-NEU-001',
        assignedOffice: 'Consultorio 103',
        consultationFee: 1800.0,
        biography: 'Neurólogo especializado en trastornos del sistema nervioso',
        yearsOfExperience: 12,
        isAvailable: false,
      },
    });

    console.log(`✅ 4 specialists created\n`);

    // ============================================
    // CITAS
    // ============================================
    console.log('📅 Creating appointments...');

    const appointments = await Promise.all([
      prisma.appointment.create({
        data: {
          patientId: patientUser1.id,
          specialistId: specialist1.id,
          scheduledDate: new Date('2026-02-10T10:00:00'),
          durationMinutes: 30,
          status: 'CONFIRMED',
          reason: 'Consulta de seguimiento cardiológico',
          notes: 'Paciente con antecedentes de hipertensión',
        },
      }),
      prisma.appointment.create({
        data: {
          patientId: patientUser2.id,
          specialistId: specialist3.id,
          scheduledDate: new Date('2026-02-08T15:00:00'),
          durationMinutes: 30,
          status: 'PENDING',
          reason: 'Consulta general',
        },
      }),
      prisma.appointment.create({
        data: {
          patientId: patientUser1.id,
          specialistId: specialist2.id,
          scheduledDate: new Date('2026-02-05T09:00:00'),
          durationMinutes: 60,
          status: 'COMPLETED',
          reason: 'Radiografía de tórax',
          notes: 'Estudio completado sin anomalías',
        },
      }),
    ]);

    console.log(`✅ ${appointments.length} appointments created\n`);

    // ============================================
    // RESUMEN
    // ============================================
    console.log('═══════════════════════════════════════');
    console.log('✅ Database seeding completed successfully!');
    console.log('═══════════════════════════════════════');
    console.log('\n📊 Summary:');
    console.log(`   - Users: 9`);
    console.log(`   - Specialists: 4`);
    console.log(`   - Appointments: ${appointments.length}`);
    console.log('\n🔑 Test credentials:');
    console.log('   ┌────────────────────────────────────────┐');
    console.log('   │ ADMINISTRADOR                          │');
    console.log('   ├────────────────────────────────────────┤');
    console.log('   │ Email: admin@mariavita.com             │');
    console.log('   │ Password: Admin2026!                   │');
    console.log('   ├────────────────────────────────────────┤');
    console.log('   │ ESPECIALISTAS                          │');
    console.log('   ├────────────────────────────────────────┤');
    console.log('   │ Email: doctor@mariavita.com            │');
    console.log('   │ Password: Doctor2026!                  │');
    console.log('   ├────────────────────────────────────────┤');
    console.log('   │ PACIENTES                              │');
    console.log('   ├────────────────────────────────────────┤');
    console.log('   │ Email: paciente1@example.com           │');
    console.log('   │ Password: Patient2026!                 │');
    console.log('   ├────────────────────────────────────────┤');
    console.log('   │ USUARIOS DE PRUEBA                     │');
    console.log('   ├────────────────────────────────────────┤');
    console.log('   │ Email: prueba1@mariavita.com           │');
    console.log('   │ Password: Usuario1Test!                │');
    console.log('   ├────────────────────────────────────────┤');
    console.log('   │ Email: prueba2@mariavita.com           │');
    console.log('   │ Password: Usuario2Test!                │');
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
