'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { LeadStage, InvestmentGoal, ExperienceLevel, ConsultationStatus } from '@prisma/client';

export async function createProperty(data: any) {
    try {
        const property = await prisma.property.create({ data });
        revalidatePath('/backoffice/properties');
        return { success: true, data: property };
    } catch (error) {
        console.error('Error creating property:', error);
        return { success: false, error: 'Failed to create property' };
    }
}

export async function createLead(data: any) {
    try {
        let leadStage: LeadStage = LeadStage.NEW;
        if (data.status) {
            const statusMap: Record<string, LeadStage> = {
                'NEW': LeadStage.NEW,
                'CONTACTED': LeadStage.CONTACTED,
                'QUALIFIED': LeadStage.QUALIFIED,
                'LOST': LeadStage.LOST,
                'WON': LeadStage.CONVERTED,
                'CONVERTED': LeadStage.CONVERTED
            };
            leadStage = statusMap[data.status] || LeadStage.NEW;
        }

        const leadData = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            leadSource: data.source,
            leadStage: leadStage,
            capital: 0,
            investmentGoal: InvestmentGoal.GROWTH,
            experienceLevel: ExperienceLevel.BEGINNER
        };

        const lead = await prisma.lead.create({ data: leadData });
        revalidatePath('/backoffice/leads');

        if (data.notes) {
            await prisma.activityLog.create({
                data: {
                    leadId: lead.id,
                    action: 'NOTE_ADDED',
                    entity: 'Lead',
                    metadata: { note: data.notes }
                }
            });
        }

        return { success: true, data: lead };
    } catch (error: any) {
        console.error('Error creating lead:', error);
        return { success: false, error: error.message };
    }
}

export async function createConsultoria(data: any) {
    try {
        // 1. Find or Create Lead
        let lead = await prisma.lead.findFirst({ where: { email: data.clientName } }); // Quick hack usage of name field for email? The form assumes name.
        // Actually, the form asks for 'clientName'. If we want to link to a lead, we'd need email.
        // For now, let's create a placeholder lead with that name or link to existing.
        // To be safe and avoid logic errors, I will create a lead with this name and a dummy email if not provided, 
        // OR better: Just create it without email if schema allows (schema requires email).
        // I'll assume clientName IS an identifier or just create a new lead with generated email.

        // Better approach: Check if data has more info? No, the form is simple.
        // Let's create a lead with a generated email placeholder so we satisfy the foreign key.

        const timestamp = Date.now();
        const placeholderEmail = `client_${timestamp}@placeholder.com`;

        lead = await prisma.lead.create({
            data: {
                name: data.clientName,
                email: placeholderEmail,
                capital: 0,
                investmentGoal: InvestmentGoal.GROWTH,
                experienceLevel: ExperienceLevel.BEGINNER
            }
        });

        // 2. Create Consultation
        // Schema: leadId, consultantId (required), scheduledAt, status, price
        // We lack 'consultantId' from the form context (usually the logged in user).
        // I will fetch the first user with admin/consultant role to assign, or hardcode a placeholder ID if seeded.

        const consultant = await prisma.user.findFirst({
            where: { role: { in: ['ADMIN', 'CONSULTANT'] } }
        });

        if (!consultant) throw new Error('No consultant available to assign.');

        const statusMap: Record<string, ConsultationStatus> = {
            'SCHEDULED': ConsultationStatus.SCHEDULED,
            'CONFIRMED': ConsultationStatus.CONFIRMED,
            'COMPLETED': ConsultationStatus.COMPLETED,
            'CANCELLED': ConsultationStatus.CANCELLED
        };

        const consultation = await prisma.consultation.create({
            data: {
                leadId: lead.id,
                consultantId: consultant.id,
                scheduledAt: new Date(data.date),
                status: statusMap[data.status] || ConsultationStatus.SCHEDULED,
                price: parseFloat(data.investment.toString()) * 0.01, // Arbitrary price logic or 0
                consultantNotes: data.notes
            }
        });

        revalidatePath('/backoffice/consultorias');
        return { success: true, data: consultation };
    } catch (error: any) {
        console.error('Error creating consultoria:', error);
        return { success: false, error: error.message };
    }
}
