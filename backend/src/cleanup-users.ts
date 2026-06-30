import prisma from './models/prisma';

async function main() {
  console.log('Fetching all users in the database...');
  const users = await prisma.user.findMany({
    include: {
      events: true,
      orders: true,
    }
  });

  console.log(`Found ${users.length} users in total:`);
  for (const user of users) {
    const displayRole = user.role.toLowerCase() === 'organizer' ? 'organiser' : user.role.toLowerCase();
    console.log(`- ID: ${user.id}, Email: ${user.email}, Role: ${displayRole}, Events count: ${user.events.length}, Orders count: ${user.orders.length}`);
  }

  // Filter users that do NOT end in gmail.com (or .gmail.com or @gmail.com)
  // Let's check both endsWith('gmail.com') and endsWith('.gmail.com') to be safe.
  // Actually, standard gmail accounts end with '@gmail.com'. Let's find users whose email does not end with '@gmail.com' and does not end with 'gmail.com'.
  const usersToDelete = users.filter(user => {
    const email = user.email.toLowerCase();
    return !email.endsWith('@gmail.com') && !email.endsWith('.gmail.com') && !email.endsWith('gmail.com');
  });

  if (usersToDelete.length === 0) {
    console.log('\nNo users found that match the deletion criteria.');
    return;
  }

  console.log(`\nFound ${usersToDelete.length} users to delete:`);
  for (const user of usersToDelete) {
    console.log(`- Deleting: ${user.email} (ID: ${user.id})`);
  }

  // For each user to delete, handle cascade deletion to avoid foreign key violations:
  for (const user of usersToDelete) {
    // 1. If user has orders, delete or disassociate them.
    // Order has items (OrderItem) which refer to Order. So delete OrderItem first, then Order.
    if (user.orders.length > 0) {
      console.log(`  Cleaning up orders for ${user.email}...`);
      for (const order of user.orders) {
        // Delete MpesaTransaction if exists
        await prisma.mpesaTransaction.deleteMany({
          where: { orderId: order.id }
        });
        // Delete OrderItems
        await prisma.orderItem.deleteMany({
          where: { orderId: order.id }
        });
        // Delete Order
        await prisma.order.delete({
          where: { id: order.id }
        });
      }
    }

    // 2. If user has created events (as organizer), we must delete those events.
    // Events have TicketTypes, and Orders can reference those events.
    if (user.events.length > 0) {
      console.log(`  Cleaning up events created by ${user.email}...`);
      for (const event of user.events) {
        // Delete OrderItems referencing tickets of this event
        await prisma.orderItem.deleteMany({
          where: {
            ticketType: {
              eventId: event.id
            }
          }
        });
        // Delete MpesaTransactions referencing orders of this event
        await prisma.mpesaTransaction.deleteMany({
          where: {
            order: {
              eventId: event.id
            }
          }
        });
        // Delete Orders referencing this event
        await prisma.order.deleteMany({
          where: { eventId: event.id }
        });
        // Delete TicketTypes referencing this event
        await prisma.ticketType.deleteMany({
          where: { eventId: event.id }
        });
        // Delete Event
        await prisma.event.delete({
          where: { id: event.id }
        });
      }
    }

    // 3. Finally, delete the User
    await prisma.user.delete({
      where: { id: user.id }
    });
    console.log(`  Successfully deleted user ${user.email}.`);
  }

  console.log('\nCleanup finished successfully.');
}

main()
  .catch(err => {
    console.error('Error during cleanup:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
