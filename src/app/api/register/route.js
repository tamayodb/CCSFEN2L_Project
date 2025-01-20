import account from "../../../../models/accounts";
import connectToDatabase from "../../../../lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectToDatabase(); // Establish database connection

    const { email, password } = await request.json();
    const userExistence = await account.findOne({ email });
    if (userExistence) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const newAccount = new account({ email, password: hashPassword }); // Use 'account' here
    await newAccount.save();

    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
