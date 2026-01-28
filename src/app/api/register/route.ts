import { NextResponse } from 'next/server';

export const runtime = 'edge'; // Cloudflare Pages supports Edge runtime

export async function POST(request: Request) {
    try {
        const { username, game_username, email, password } = await request.json();

        // In a real app, save to DB or send email
        console.log('Registration Data Received:', { username, game_username, email, password_length: password?.length });

        // Simulate delay
        // await new Promise(resolve => setTimeout(resolve, 1000));

        return NextResponse.json({
            message: 'Registration successful',
            data: { username, game_username, email }
        }, { status: 200 });
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
