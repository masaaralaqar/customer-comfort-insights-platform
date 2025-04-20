
import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';

const prisma = new PrismaClient();

export const saveCustomerServiceData = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await prisma.customerServiceData.create({
      data: {
        period: data.period,
        complaints: data.calls.complaints,
        contactRequests: data.calls.contactRequests,
        maintenanceRequests: data.calls.maintenanceRequests,
        inquiries: data.calls.inquiries,
        officeInterested: data.calls.officeInterested,
        projectsInterested: data.calls.projectsInterested,
        customersInterested: data.calls.customersInterested,
        generalInquiries: data.inquiries.general,
        documentRequests: data.inquiries.documentRequests,
        deedInquiries: data.inquiries.deedInquiries,
        apartmentRentals: data.inquiries.apartmentRentals,
        soldProjects: data.inquiries.soldProjects,
        maintenanceCancelled: data.maintenance.cancelled,
        maintenanceResolved: data.maintenance.resolved,
        maintenanceInProgress: data.maintenance.inProgress
      }
    });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'حدث خطأ أثناء حفظ البيانات' });
  }
};
