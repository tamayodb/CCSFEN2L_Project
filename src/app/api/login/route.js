import account from "../../../../models/accounts";
import connectToDatabase from "../../../../lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectToDatabase(); // Establish database connection

    const { email, password } = await request.json();
    const userExistence = await account.findOne({ email });
    if (!userExistence) {
      return NextResponse.json({ error: "User not existed" }, { status: 400 });
    }
    const checkPassword = await bcrypt.compare(
      password,
      userExistence.password
    );

    if (!checkPassword) {
      return NextResponse.json(
        { message: "Wrong Password" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Login successfully" },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
