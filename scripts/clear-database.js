const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    console.log('Starting database cleanup...');
    
    // Delete in order to respect foreign key constraints
    // First delete payments (they reference students and bookings)
    console.log('Deleting payments...');
    const deletedPayments = await prisma.payment.deleteMany({});
    console.log(`Deleted ${deletedPayments.count} payments`);
    
    // Delete booking students (junction table)
    console.log('Deleting booking students...');
    const deletedBookingStudents = await prisma.bookingStudent.deleteMany({});
    console.log(`Deleted ${deletedBookingStudents.count} booking students`);
    
    // Delete bookings
    console.log('Deleting bookings...');
    const deletedBookings = await prisma.booking.deleteMany({});
    console.log(`Deleted ${deletedBookings.count} bookings`);
    
    // Finally delete students
    console.log('Deleting students...');
    const deletedStudents = await prisma.student.deleteMany({});
    console.log(`Deleted ${deletedStudents.count} students`);
    
    console.log('✅ Database cleared successfully!');
    console.log(`Summary:`);
    console.log(`- Students: ${deletedStudents.count}`);
    console.log(`- Bookings: ${deletedBookings.count}`);
    console.log(`- Booking Students: ${deletedBookingStudents.count}`);
    console.log(`- Payments: ${deletedPayments.count}`);
    
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();
