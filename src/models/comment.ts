// import { Document, Model, Schema, Types, model } from "mongoose";
// import { Goaltype } from "../../libs/types";
// type IGoalEntry = Record<"status", boolean> &
//   Record<"goalTitle" | "problemImage", string> &
//   Record<"createdDate" | "updatedDate", Readonly<Date>> & {
//     type: Goaltype;
//     createdById: Types.ObjectId;
//     parentOrgId: Types.ObjectId;
//     lastUpdatedById: Types.ObjectId;
//     problemId: Types.ObjectId;
//     programId: Types.ObjectId;
//   };
// export interface IGoalEntrySchemaDocument extends IGoalEntry, Document {}
// export type IGoalEntryDocument = Document<IGoalEntrySchemaDocument>;
// export interface IGoalEntrySchemaModel
//   extends Model<IGoalEntrySchemaDocument> {}
// const GoalEntrySchema = new Schema<
//   IGoalEntrySchemaDocument,
//   IGoalEntrySchemaModel
// >(
//   {
//     problemId: {
//       type: Schema.Types.ObjectId,
//       required: true,
//       index: true,
//       ref: "goal_problem",
//     },
//     programId: {
//       type: Schema.Types.ObjectId,
//       required: false,
//       index: true,
//     },
//     parentOrgId: {
//       type: Schema.Types.ObjectId,
//       required: true,
//       index: true,
//     },
//     goalTitle: {
//       type: String,
//       trim: true,
//       index: true,
//     },
//     type: {
//       type: String,
//       enum: ["SYSTEM_GOAL", "CUSTOM_GOAL"],
//       default: Goaltype.SystemGoal,
//       index: true,
//     },
//     createdById: {
//       type: Schema.Types.ObjectId,
//       required: false,
//       index: true,
//     },
//     lastUpdatedById: {
//       type: Schema.Types.ObjectId,
//       required: false,
//       index: true,
//     },
//     status: {
//       type: Boolean,
//       required: false,
//       default: false,
//     },
//   },
//   {
//     timestamps: {
//       createdAt: "createdDate",
//       updatedAt: "updatedDate",
//     },
//   }
// );
// export const GoalEntryModel = model<
//   IGoalEntrySchemaDocument,
//   IGoalEntrySchemaModel
// >("goal_entry", GoalEntrySchema);







