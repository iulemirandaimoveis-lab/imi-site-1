'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { LeadStage, InvestmentGoal, ExperienceLevel } from '@prisma/client';

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
        // Map form fields to Prisma schema
        // Form: name, email, phone, source, status, notes
        // Schema: name, email, phone, leadSource, leadStage, capital, investmentGoal, experienceLevel

        let leadStage: LeadStage = LeadStage.NEW;
        if (data.status) {
            // Map common status to exact Enum
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
            leadSource: data.source, // Mapping source -> leadSource
            leadStage: leadStage,
            // Defaults for required fields not in form
            capital: 0,
            investmentGoal: InvestmentGoal.GROWTH,
            experienceLevel: ExperienceLevel.BEGINNER
        };

        const lead = await prisma.lead.create({ data: leadData });
        revalidatePath('/backoffice/leads');

        // Optionally handle notes if we had a place for them, e.g. create an ActivityLog
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
