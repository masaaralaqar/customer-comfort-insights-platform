
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'طريقة غير مسموح بها' });
  }

  try {
    const data = req.body;
    const result = await prisma.customerServiceData.create({
      data: {
        period: data.period,
        complaints: data.complaints,
        contactRequests: data.contactRequests,
        maintenanceRequests: data.maintenanceRequests,
        inquiries: data.inquiries,
        officeInterested: data.officeInterested,
        projectsInterested: data.projectsInterested,
        customersInterested: data.customersInterested
      }
    });
    res.status(200).json(result);
  } catch (error) {
    console.error('خطأ في حفظ البيانات:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء حفظ البيانات' });
  }
}
