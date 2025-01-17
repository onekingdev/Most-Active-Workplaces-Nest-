const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getTopWorkplaces() {
  try {
    const workplaces = await prisma.workplace.findMany({
      include: {
        shifts: {
          where: {
            cancelledAt: null,
          },
        },
      },
    });

    const workplaceShifts = workplaces.map((workplace) => ({
      name: workplace.name,
      shifts: workplace.shifts.length,
    }));

    return workplaceShifts.sort((a, b) => b.shifts - a.shifts).slice(0, 3);
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

getTopWorkplaces().then((topWorkplaces) => {
  console.log(JSON.stringify(topWorkplaces, null, 2));
});