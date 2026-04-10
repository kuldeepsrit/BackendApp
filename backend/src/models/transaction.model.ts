import mongoose, { Schema, Document } from "mongoose";


export interface ITransaction extends Document {
  amount: number;
  type: "income" | "expense";
  category: string;
  date: Date;
  notes?: string;
}


const TransactionSchema: Schema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount must be positive"]
    },

    type: {
      type: String,
      enum: ["income", "expense"],
      required: true
    },

    category: {
      type: String,
      required: true
    },

   date: {
      type: Date,
      required: true
    },
     notes: {
      type: String
    }
  },

  { timestamps: true }
);


export const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema
);