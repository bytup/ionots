import { updateProjectStatus, updateMilestoneProgress } from '@/db/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { userProjectId, status, progress, milestoneId, milestoneCompleted } = await request.json();
        
        if (milestoneId !== undefined) {
            await updateMilestoneProgress(userProjectId, milestoneId, milestoneCompleted);
        }
        
        if (status && progress !== undefined) {
            await updateProjectStatus(userProjectId, status, progress);
        }
        
        return NextResponse.json({ message: 'Progress updated successfully' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
