import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import React from "react";
import backendInstance from "../../instances/serverInstance";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from '@mui/icons-material/Info';
import { IconButton, Box, Tooltip } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const MoneyEntries = ({ entries }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const deleteEntry = async (id) => {
    dispatch({ type: "SET_BD_STATE_ACTIVE", data: "DELETE_ENTRY" });
    const response = await backendInstance.delete(`transaction/delete/${id}`);
    alert(response.data.message);
  };

  const editEntry = async (id) => {
    dispatch({ type: "SET_BD_STATE_ACTIVE", data: `EDIT_ENTRY_${id}` });
  };

  const entryInfo = async (id) => {
    navigate(`/transaction/${id}`);
  };

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Type</Th>
          <Th>Category</Th>
          <Th>Paid To</Th>
          <Th>Amount</Th>
          <Th>Description</Th>
          <Th>Created At</Th>
          <Th>Updated At</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {entries.map((entry) => (
          <Tr key={entry._id}>
            <Td>{entry.type}</Td>
            <Td>{entry.category}</Td>
            <Td>{entry.paidTo}</Td>
            <Td>{entry.amount}</Td>
            <Td>{entry.description}</Td>
            <Td>
              {new Date(entry.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                timeZone: 'UTC',
              })}
            </Td>
            <Td>
              {new Date(entry.updatedAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                timeZone: 'UTC',
              })}
            </Td>
            <Td><Tooltip title="View" placement="left-start">
            <IconButton
                onClick={() => {
                  entryInfo(entry._id);
                }}
              >
                <InfoIcon />
              </IconButton></Tooltip>
              <Tooltip title="Edit" placement="top-start"><IconButton
                onClick={() => {
                  editEntry(entry._id);
                }}
              >
                <EditIcon />
              </IconButton></Tooltip>
              <Tooltip title="Delete" placement="left-end"><IconButton
                onClick={() => {
                  deleteEntry(entry._id);
                }}
              >
                <DeleteIcon />
              </IconButton></Tooltip>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default MoneyEntries;
