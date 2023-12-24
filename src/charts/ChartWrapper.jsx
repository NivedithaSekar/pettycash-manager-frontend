import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BarChart from "./BarChart";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";


const ChartWrapper = ({ chartType, data, title, filter }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const transformedData = []

  const uniqueFiterValue = [...new Set(data.map(item => item[filter]))];
  for(let i=0; i<uniqueFiterValue.length; i++){     
    let uniqueFiterData = {type:title, filterId : uniqueFiterValue[i]}
    data.filter((item) => item[filter] === uniqueFiterValue[i]).forEach((item)=>{
      uniqueFiterData[item.category] =  item.totalAmount
    })
    transformedData.push(uniqueFiterData)
  }

  const component =
    chartType === "BarChart" ? (
      <BarChart data={transformedData} filterOption={filter} type={title}/>
    ) : (
      ""
    );
  
  return (
    <Card sx={{ backgroundColor: colors.primary[400] }}>
      <CardHeader
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={<Typography variant="h4">{title}</Typography>}
      />
      <CardContent sx={{ height: "22rem", p: 0 }}>{component}</CardContent>
    </Card>
  );
};

export default ChartWrapper;



///Worked Out Code --- 
// async function transformData(data, filter){
//   for (let i = 0; i < data.length; i++) {
//     let indexFound = chartResult.findIndex((item) => {
//       if (item[filter] === data[i][filter]) {
//         return true;
//       }
//       return false;
//     });
//     if (indexFound === -1) {
//       chartResult.push({
//         [filter]: data[i][filter],
//         [data[i].type]: data[i].totalAmount,
//       });
//     } else {
//       chartResult.some((item) => {
//         if (item?.[data[i].type]) {
//           chartResult[indexFound] = {
//             ...chartResult[indexFound],
//             [data[i].type]:
//               chartResult[indexFound][data[i].type] + data[i].totalAmount,
//           };
//         } else {
//           chartResult[indexFound] = {
//             ...chartResult[indexFound],
//             [data[i].type]: data[i].totalAmount,
//           };
//         }
//       });
//     }
//   }
// }



// const chartResult=[{type:"FUND_IN"},{type:"FUND_OUT"}]

// const [ transformedData, setTransformedData ] = useState([])
// useEffect(()=>{
//  if(filter === "month"){
//    for(let i=0; i<uniqueMonths.length; i++){
//      let uniqueMonthData = {type:title,month: uniqueMonths[i]}
//      data.filter((item) => item.month === uniqueMonths[i]).forEach((item)=>{
//        uniqueMonthData[item.category] =  item.totalAmount
//      })
//      setTransformedData((transformedData)=>[...transformedData,uniqueMonthData])
//    }
//  }else{
//    for(let i=0; i<uniqueYears.length; i++){
//      let uniqueMonthData = {type:title,month: uniqueYears[i]}
//      data.filter((item) => item.month === uniqueYears[i]).forEach((item)=>{
//        uniqueMonthData[item.category] =  item.totalAmount
//      })
//      setTransformedData((transformedData)=>[...transformedData,uniqueMonthData])
//    }
//  }
// },[]) 


// if(filter === "month"){
  //   const uniqueMonths = [...new Set(data.map(item => item.month))];
  //   for(let i=0; i<uniqueMonths.length; i++){     
  //     let uniqueMonthData = {type:title,month: uniqueMonths[i]}
  //     data.filter((item) => item.month === uniqueMonths[i]).forEach((item)=>{
  //       uniqueMonthData[item.category] =  item.totalAmount
  //     })
  //     transformedData.push(uniqueMonthData)
  //   }
  // }else{
  //   const uniqueYears = [...new Set(data.map(item => item.year))];
  //   for(let i=0; i<uniqueYears.length; i++){  
  //     let uniqueYearData = {type:title,year: uniqueYears[i]}
  //     data.filter((item) => item.year === uniqueYears[i]).forEach((item)=>{
  //       uniqueYearData[item.category] =  item.totalAmount
  //     })
  //     transformedData.push(uniqueYearData)
  //   }
  // }
   