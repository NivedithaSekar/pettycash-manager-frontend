import React, { useEffect, useReducer, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {
  Card,
  CardContent,
  IconButton,
  ListSubheader,
  Typography,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useTheme } from "@emotion/react";
import { tokens } from "../theme";
import { useDispatch, useSelector } from "react-redux";
import MoneyEntries from "./entries/MoneyEntries";
import backendInstance from "../instances/serverInstance";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import dayjs from "dayjs";


const EntryManagement = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  //Initial declaration of variables
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const { backdropDetails: backdropActivity, path } = useSelector(
    (state) => state.backdropReducer
  );

  //state variables
  const [entries, setEntries] = useState({
    capitalBalance: 0,
    transactions: [],
  });

  //dispatching action via reducers
  const createNewEntry = () => {
    dispatch({ type: "SET_BD_STATE_ACTIVE", data: "NEW_ENTRY" });
  };

  useEffect(() => {
    getEntries();
    //checkSessionExpiry();
    window.history.pushState(null, "", path);
  }, [backdropActivity]);


  const getEntries = async () => {
    await backendInstance
      .get(`/balance?userId=${user.userID}`)
      .then((response) => setEntries(response.data))
      .catch((error) => {
        alert(
          JSON.stringify({
            code: error.code,
            message: error.response.data.message,
          })
        );
      });
  };

  

  // const checkSessionExpiry = async () => {
  //   const response = await backendInstance.get(`/`);
  //   if (response.data.message === "Not Authorized!!" || response.data.message=== "Invalid token") {
  //     alert(response.data.message);
  //     dispatch({ type: "SESSION_EXPIRED" });
  //     localStorage.removeItem("user");
  //   }
  // };

  const handleFilterEntry = (state, action) => {
    const filterObj = action.filterObj;
    if (action.type === "GET_DATA") {
      return({
        ...state,
        isFilterActive: false,
        filteredTransactions:entries.transactions,
        filterObj: action.filterObj
      });
    } else {
      const filteredEntries = entries.transactions.filter((entry) => {
        let createdDate = dayjs(entry.createdAt); 
        
        return filterObj.type != "-"
          ? entry.type == filterObj.type
          : entries && filterObj.category != "-"
          ? entry.category == filterObj.category
          : entries && filterObj.from_date != "01-01-1900"
          ? dayjs(createdDate).isAfter(dayjs(filterObj.to_date).endOf("day"))
          : entries && filterObj.to_date != "01-01-1900"
          ? dayjs(createdDate).isBefore(dayjs(filterObj.to_date).endOf("day"))
          : entries;
        });
          return({
            ...state,
            isFilterActive: true,
            filteredTransactions:filteredEntries,
            filterObj : action.filterObj
          })
    }
  };
  
  const [filterEntry, setFilterEntry] = useReducer(handleFilterEntry, {
    filterObj: {},
    isFilterActive: false,
    filteredTransactions:[]
  });
  return (
    <Box sx={{ flexGrow: 1, p: "10px" }}>
      {/* New Entry & Capital Balance */}
      <Grid
        container
        spacing={2}
        sx={{
          pr: 10,
          pl:10,
          alignItems: "center",
          flexDirection: "row-reverse",
          justifyContent: "space-between",
        }}
      >
        <Grid item >
          <IconButton
            color={colors.primary[400]}
            aria-label="Create New Entry"
            size="large"
            onClick={createNewEntry}
          >
            <AddCircleIcon sx={{ fontSize: "3.5rem" }} />
          </IconButton>
          <Typography variant="button">New Entry</Typography>
        </Grid>
        <Grid item xs={12} md={8} lg={4}>
          <Card
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              backgroundColor: colors.primary[400],
            }}
          >
            <AccountBalanceWalletIcon sx={{ fontSize: "5.1rem" }} />
            <CardContent>
              <Typography gutterBottom variant="h3" component="div">
                Capital Balance
              </Typography>
              <Typography variant="h2" component="div">
                {entries.capitalBalance}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <br />
      <FilterForm dispatch={setFilterEntry} />
      {"transactions" in entries ? (
        <MoneyEntries
          entries={
            filterEntry.isFilterActive ? filterEntry.filteredTransactions : entries.transactions
          }
        />
      ) : (
        ""
      )}
    </Box>
  );
};

export default EntryManagement;

const FilterForm = ({ dispatch }) => {
  const INITIAL_FILTER_STATE = {
    type: "-",
    category: "-",
    paidTo: "-",
    from_date: "01-01-1900",
    to_date: "01-01-1900",
  };
  //state variable
  const [filterForm, setfilterForm] = useState(INITIAL_FILTER_STATE);
  //form submission handler
  function handleFormSubmission(e) {
    e.preventDefault();
    dispatch({ type:"GET_FILTERED_DATA", filterObj: filterForm});
  }

  //Filter form component
  return (
    <form className="filter-form" onSubmit={handleFormSubmission}>
      <Grid container spacing={2}>
        <Grid item>
          <FormControl sx={{ width: 100, mt: 1 }}>
            <InputLabel id="type">Type</InputLabel>
            <Select
              labelId="type"
              id="type"
              required
              value={filterForm.type}
              label="type"
              onChange={(event) => {
                setfilterForm((form) => ({
                  ...form,
                  type: event.target.value,
                }));
              }}
            >
              <MenuItem value="-">None</MenuItem>
              <MenuItem value="FUND_IN">Fund In</MenuItem>
              <MenuItem value="FUND_OUT">Fund Out</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl sx={{ width: 100, mt: 1 }}>
            <InputLabel id="category">category</InputLabel>
            <Select
              labelId="category"
              id="category"
              required
              value={filterForm.category}
              label="category"
              onChange={(event) => {
                setfilterForm((form) => ({
                  ...form,
                  category: event.target.value,
                }));
              }}
            >
              <MenuItem value="-">None</MenuItem>
              <ListSubheader>Fund In</ListSubheader>
              <MenuItem value="Account">Account</MenuItem>
              <MenuItem value="Cash">Cash</MenuItem>
              <ListSubheader>Fund Out</ListSubheader>
              <MenuItem value="Office Supplies">Office Supplies</MenuItem>
              <MenuItem value="Lodging">Lodging</MenuItem>
              <MenuItem value="Food">Food</MenuItem>
              <MenuItem value="Transporation">Transporation</MenuItem>
              <MenuItem value="Entertainment">Entertainment</MenuItem>
              <MenuItem value="Utilities">Utilities</MenuItem>
              <MenuItem value="Bills">Bills</MenuItem>
              <MenuItem value="SkillUp">SkillUp</MenuItem>
              <MenuItem value="Client">Client</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                className="input-field"
                label="From"
                value={dayjs(filterForm.from_date)}
                disableFuture={true}
                onChange={(newValue) => {
                  setfilterForm((form) => ({
                    ...form,
                    from_date: newValue.format("MM-DD-YYYY"),
                  }));
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Grid>
        <Grid item>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                className="input-field"
                label="To"
                value={dayjs(filterForm.to_date)}
                disableFuture={true}
                onChange={(newValue) => {
                  setfilterForm((form) => ({
                    ...form,
                    to_date: newValue.format("MM-DD-YYYY"),
                  }));
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          sx={{ minWidth: "5%", borderRadius: "50%", ml: 2 }}
        >
          <FilterAltIcon sx={{ fontSize: "2.5rem" }} />
        </Button>
        <Button
          type="reset"
          variant="contained"
          sx={{ minWidth: "5%", borderRadius: "50%", ml: 2 }}
          onClick={() => {
            setfilterForm(INITIAL_FILTER_STATE);
            dispatch({ type:"GET_DATA", filterObj: filterForm});
          }}
        >
          <RestartAltIcon sx={{ fontSize: "3rem" }} />
        </Button>
      </Grid>
    </form>
  );
};

//window.location.pathname == undefined ? path: window.location.pathname.includes("transaction")? path.slice(11): '/'