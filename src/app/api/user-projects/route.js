import { getUserProjects } from '@/db/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        
        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }
        
        const projects = await getUserProjects(userId);
        return NextResponse.json(Array.isArray(projects) ? projects : []);
    } catch (error) {
        console.error('Error fetching user projects:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
