import { useContext } from "react";
import { LeaveContext } from "../context/LeaveContext";
import leaveApi from "../api/leaveApi";

export const useLeave = () => {
  const { leaves, setAllLeaves } = useContext(LeaveContext);

  const fetchLeaves = async () => {
    const res = await leaveApi.getAll();
    setAllLeaves(res.data);
  };

  const createLeave = async (data) => await leaveApi.create(data);
  const updateLeave = async (id, data) => await leaveApi.update(id, data);
  const deleteLeave = async (id) => await leaveApi.remove(id);
  const approveLeave = async (id) => await leaveApi.approve(id);
  const rejectLeave = async (id, reason) => await leaveApi.reject(id, reason);

  return { leaves, fetchLeaves, createLeave, updateLeave, deleteLeave, approveLeave, rejectLeave };
};
