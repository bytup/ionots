import { getProjects, assignProject } from '@/db/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const projects = await getProjects();
        return NextResponse.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { userId, projectId } = await request.json();
        if (!userId || !projectId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        
        await assignProject(userId, projectId);
        return NextResponse.json({ message: 'Project assigned successfully' });
    } catch (error) {
        console.error('Error assigning project:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
