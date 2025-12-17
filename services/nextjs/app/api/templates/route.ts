import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { withAuth } from '@/shared/lib/middleware';

async function createTemplate(request: NextRequest, userId: string) {
  try {
    const { name, description, category, title, content } = await request.json();

    if (!name || !title || !content) {
      return NextResponse.json(
        { error: 'Template name, title, and content are required' }, 
        { status: 400 }
      );
    }

    // Verify user exists in database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' }, 
        { status: 404 }
      );
    }

    // Save template to database (always private to the user)
    const template = await prisma.template.create({
      data: {
        name,
        description: description || '',
        category: category || 'General',
        title,
        content,
        isPublic: false, // Always private
        userId,
      },
    });

    console.log('Template created:', template);

    return NextResponse.json({
      success: true,
      template,
      message: 'Template created successfully'
    });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: 'Failed to create template' }, 
      { status: 500 }
    );
  }
}

export const POST = withAuth(createTemplate);

async function getTemplates(request: NextRequest, userId: string) {
  try {
    // Verify user exists in database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' }, 
        { status: 404 }
      );
    }

    // Fetch only user's own templates
    const templates = await prisma.template.findMany({
      where: {
        userId // Only user's own templates
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        title: true,
        content: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      }
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' }, 
      { status: 500 }
    );
  }
}

export const GET = withAuth(getTemplates);
