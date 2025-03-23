// app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { createUser, getUserByEmail } from '@/lib/user';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    
    // Validate the data
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }
    
    // Hash the password
    const hashedPassword = await hash(password, 10);
    
    // Create the user
    const user = await createUser({
      name,
      email,
      password: hashedPassword,
    });
    
    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}