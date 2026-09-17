import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Policy from '@/models/Policy';

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const policy = await Policy.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!policy) {
      return NextResponse.json({ success: false, message: 'Policy not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: policy });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const deletedPolicy = await Policy.findByIdAndDelete(id);
    if (!deletedPolicy) {
      return NextResponse.json({ success: false, message: 'Policy not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
