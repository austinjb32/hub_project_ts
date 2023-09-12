import DataLoader from "dataloader";
import UserModel from "./users.model";


const getUserbyId= async (id:string)=>{
  const user= await UserModel.findById(id);
  return user
  }

export const getUserLoader = () => new DataLoader(async (userIds) => {
  return userIds.map((id:any)=>getUserbyId(id));
})
