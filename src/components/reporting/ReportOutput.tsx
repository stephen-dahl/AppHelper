import React, { useRef } from "react";
import { ArrayHelper, PersonInterface, ReportInterface, ReportResultInterface } from "@churchapps/helpers";
import { DisplayBox, ExportLink, Loading } from "../"
import { ApiHelper } from "../../helpers"
import { useReactToPrint } from "react-to-print";
import { TableReport } from "./TableReport";
import { ChartReport } from "./ChartReport";
import { TreeReport } from "./TreeReport";
import { Button, Icon, Menu, MenuItem } from "@mui/material";
import { useMountedState } from "../../hooks/useMountedState";

interface Props { report: ReportInterface }

export const ReportOutput = (props: Props) => {
  const [reportResult, setReportResult] = React.useState<ReportResultInterface>(null);
  const [detailedPersonSummary, setDetailedPersonSummary] = React.useState<any[]>(null);
  const [customHeaders, setCustomHeaders] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const contentRef = useRef<HTMLDivElement>(null);
  const isMounted = useMountedState();

  const handlePrint = useReactToPrint({
    content: () => contentRef.current
  })

  const populatePeople = async (data: any[]) => {
    let result: any[] = [];
    let headers: {label: string, key: string}[] = [];
    const peopleIds = ArrayHelper.getIds(data, "personId");
    if (peopleIds.length > 0) {
      const people = await ApiHelper.get("/people/ids?ids=" + peopleIds.join(","), "MembershipApi");
      const filteredData = data.filter((d) => d.personId !== null);
      filteredData.forEach((d) => {
        const person: PersonInterface = ArrayHelper.getOne(people, "id", d.personId);
        const funds = Object.assign({}, ...d.funds);
        const obj = {
          firstName: person.name.first,
          lastName: person.name.last,
          email: person.contactInfo?.email,
          address: person.contactInfo.address1 + (person.contactInfo.address2 ? `, ${person.contactInfo.address2}` : ""),
          city: person.contactInfo.city,
          state: person.contactInfo.state,
          zip: person.contactInfo.zip,
          totalDonation: d.totalAmount,
          ...funds
        };
        result.push(obj);
      });
    }

    //for anonymous donations
    const anonDonations = ArrayHelper.getOne(data, "personId", null);
    if (anonDonations) {
      const funds = Object.assign({}, ...anonDonations.funds);
      const obj = {
        firstName: "Anonymous",
        totalDonation: anonDonations.totalAmount,
        ...funds
      }
      result.push(obj);
    }

    //set custom headers
    const maxKeysObj = result?.reduce((a, b) => {
      return Object.keys(a).length > Object.keys(b).length ? a : b;
    }, []);
    const objKeys = Object.keys(maxKeysObj);
    objKeys.forEach(key => headers.push({ label: key, key: key }));

    setCustomHeaders(headers);
    setDetailedPersonSummary(result);
  }

  const runReport = () => {
    if (props.report) {
      const queryParams: string[] = [];
      props.report.parameters.forEach(p => {
        if (p.value) queryParams.push(p.keyName + "=" + p.value);
      });
      let url = "/reports/" + props.report.keyName + "/run";
      if (queryParams) url += "?" + queryParams.join("&");

      ApiHelper.get(url, "ReportingApi").then((data: ReportResultInterface) => {
        if(isMounted()) {
          setReportResult(data);
        }
      });

      const donationUrl = "/donations/summary?type=person&" + queryParams.join("&");
      ApiHelper.get(donationUrl, "GivingApi").then((data) => { populatePeople(data); });
    }
  }

  const getExportMenu = (key: number) => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
      setAnchorEl(null);
    }
    return (<>
      <Button size="small" title="Download Options" onClick={handleClick} key={key}><Icon>download</Icon></Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {reportResult?.table?.length > 0 && <MenuItem sx={{ padding: "5px" }} onClick={handleClose}><ExportLink data={reportResult.table} filename={props.report.displayName.replace(" ", "_") + ".csv"} text="Fund Summary" icon="volunteer_activism" /></MenuItem>}
        {detailedPersonSummary?.length > 0 && <MenuItem sx={{ padding: "5px" }} onClick={handleClose}><ExportLink data={detailedPersonSummary} filename="Detailed_Donation_Summary.csv" text="Detailed Summary" icon="person" customHeaders={customHeaders} spaceAfter={true} /></MenuItem>}
      </Menu>
    </>)
  }

  React.useEffect(runReport, [props.report, isMounted]);

  const getEditContent = () => {
    const result: JSX.Element[] = [];

    if (reportResult) {
      result.push(<button type="button" className="no-default-style" key={result.length - 2} onClick={handlePrint} title="print"><Icon>print</Icon></button>);
    }
    if (reportResult?.table.length > 0 || detailedPersonSummary?.length > 0) {
      result.push(getExportMenu(result.length - 1))
    }
    return result;
  }

  const getOutputs = () => {
    const result: JSX.Element[] = [];
    reportResult.outputs.forEach(o => {
      if (o.outputType === "table") result.push(<TableReport key={o.outputType} reportResult={reportResult} output={o} />)
      if (o.outputType === "tree") result.push(<TreeReport key={o.outputType} reportResult={reportResult} output={o} />)
      else if (o.outputType === "barChart") result.push(<ChartReport key={o.outputType} reportResult={reportResult} output={o} />)
    })

    return result;
  }

  const getResults = () => {
    if (!props.report) return (<DisplayBox ref={contentRef} id="reportsBox" headerIcon="summarize" headerText="Run Report" editContent={getEditContent()}><p>Use the filter to run the report.</p></DisplayBox>);

    else if (!reportResult) return <Loading />
    else {
      return (<DisplayBox ref={contentRef} id="reportsBox" headerIcon="summarize" headerText={props.report.displayName} editContent={getEditContent()}>
        {getOutputs()}
      </DisplayBox>);
    }
  }

  return (
    <>
      {getResults()}
    </>
  );
}
