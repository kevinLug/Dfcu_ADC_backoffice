import * as React from "react";
import { useEffect, useState, useMemo } from "react";

import Grid from '@material-ui/core/Grid';

import { toOptions } from "../../components/inputs/inputHelpers";
import { Box, Menu, MenuProps } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import PSelectInput from "../../components/plain-inputs/PSelectInput";
import PDateInput from "../../components/plain-inputs/PDateInput";
import { enumToArray, getRandomStr } from "../../utils/stringHelpers";
import { determineWorkflowStatus, IWorkflowFilter, WorkflowStatus, WorkflowSubStatus } from "./types";
import { workflowTypes } from "./config";

import { ConstantLabelsAndValues, remoteRoutes } from "../../data/constants";
import { useSelector } from "react-redux";

import { downLoadWithParams, triggerDownLoad } from "../../utils/ajax";
import { IList, List } from "../../utils/collections/list";
import CheckBoxTemplate, { IPropsChecks } from "../scan/validate-verify/Check";

import MenuItem from "@material-ui/core/MenuItem";

import makeStyles from "@material-ui/core/styles/makeStyles";
import { Theme, withStyles } from "@material-ui/core/styles";
import createStyles from "@material-ui/core/styles/createStyles";

import IconButton from "@material-ui/core/IconButton";

import { ICheckKeyValueState } from "../../data/redux/checks/reducer";
import { MoreHoriz } from "@material-ui/icons";
import { KeyValueMap } from "../../utils/collections/map";
import { ExportToExcel } from "../../components/import-export/ExportButton";

import { printDateTime } from "../../utils/dateHelpers";

import DataAccessConfigs from "../../data/dataAccessConfigs";
import { isNullOrEmpty, isNullOrUndefined } from "../../utils/objectHelpers";
import { IState } from "../../data/types";
import Toast from "../../utils/Toast";


const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props: MenuProps) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);

interface IProps {
    onFilter: (data: any) => any
    loading: boolean
    filterResult?: any
    setFilteredData?: (dataFiltered: any) => any

    setSearchIsHappening?: (flag: boolean) => any
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            width: '100%'
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        filterGrids: {},
        exportBtn: {
            marginLeft: 'auto'
        }
    }),
);


interface IReport {
    id: string;
    applicationDate: string;
    referenceNumber: string;
    applicantName: string;
    beneficiaryName: string;
    beneficiaryBankName: string;
    amount: number;
    currency: string;
    status: string;
}

const formatExportData = (data: any) => {

    /**
     * - Get all array
     * - For each element, pick out
     *  1 - ID
     *  2 - Application Date
     *  3 - Reference Number
     *  4 - Beneficiary Name
     *  5 - Beneficiary Bank Name
     *  6 - Amount
     *  7 - Currency
     *  8 - Status
     */

    if (!data) {
        Toast.warn('Trying to export empty data')
        throw 'trying to export empty data'
    }

    return data.map((value: any) => {

        let reportStatus = '';
        const subStatus = value.subStatus
        const status = value.status

        if (determineWorkflowStatus(status) === WorkflowStatus.Open && subStatus === WorkflowSubStatus.AwaitingCSOApproval) {
            reportStatus = WorkflowStatus.New
        }
        // awaiting BOM approval
        if (determineWorkflowStatus(status) === WorkflowStatus.Open && subStatus === WorkflowSubStatus.AwaitingBMApproval) {
            reportStatus = WorkflowStatus.Pending
        }
        // awaiting CMO clearance
        if (determineWorkflowStatus(status) === WorkflowStatus.Open && subStatus === WorkflowSubStatus.AwaitingSubmissionToFinacle) {
            reportStatus = WorkflowStatus.Approved
        }
        // erred
        if (determineWorkflowStatus(status) === WorkflowStatus.Error) {
            reportStatus = WorkflowStatus.Rejected
        }
        // closed (sent to finacle)
        if (determineWorkflowStatus(status) === WorkflowStatus.Closed) {
            reportStatus = WorkflowStatus.Cleared
        }

        const row: IReport = {
            id: value.id,
            applicationDate: printDateTime(value.applicationDate),
            referenceNumber: value.referenceNumber,
            applicantName: value.metaData.applicantName,
            beneficiaryName: value.metaData.beneficiaryName,
            beneficiaryBankName: value.metaData.beneficiaryBankName,
            amount: value.metaData.amount,
            currency: value.metaData.currency,
            status: reportStatus
        }

        return row

    })

}

enum WorkflowStatusInternal {

    Cleared = "Cleared",
    New = "New",
    Pending = "Pending",
    Rejected = "Rejected",
    Approved = 'Approved' // PendingClearance
}

export const manageBranchChosen = () => {

}

const Filter = ({ onFilter, loading, filterResult }: IProps) => {

    const classes = useStyles();

    const [data, setData] = useState<IWorkflowFilter>({
        from: null,
        to: null,
        statuses: [],
        subStatuses: [],
        workflowTypes: [],
        applicantName: '',
        beneficiaryName: '',
        branchName: '',
        branchCode: ''
    })


    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const gridSize: any = {
        xs: 6,
        sm: 3,
        md: 2,
        lg: 2,
        xl: 1
    }

    const { check }: ICheckKeyValueState = useSelector((state: any) => state.checks)
    const [branchNamesOnly, setBranchNamesOnly] = useState<string[]>([]);
    const [defaultBranchName, setDefaultBranchName] = useState('');
    const user = useSelector((state: IState) => state.core.user)

    const theDefaultBranchName = useMemo(() => {

        const result = DataAccessConfigs.getBranchOfUserSelected()!;

        if (!isNullOrEmpty(result.toString()) && !isNullOrUndefined(result)) {
            setDefaultBranchName(JSON.parse(result)['branchName'])
        }

        return defaultBranchName
    }, [])

    useEffect(() => {

        setBranchNamesOnly(ConstantLabelsAndValues.mapOfDFCUBranchCodeToBranchLabel().getValues().toArray())

        formatExportData(filterResult)

        const result = DataAccessConfigs.getBranchOfUserSelected()!;

        if (!isNullOrEmpty(result) && !isNullOrUndefined(result)) {
            setDefaultBranchName(JSON.parse(result)['branchName'])
        }

    }, [check, filterResult, defaultBranchName])

    const ids = ['status-grid', 'subStatus-grid', 'refNumber-grid', 'from-grid', 'to-grid']
    const labels = ['Status', 'Sub Status', 'Ref. Number', 'From Date', 'To Date']

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const checkListShowMoreOrLess = (): IList<IPropsChecks> => {

        const theCheckList = new List<IPropsChecks>();

        labels.forEach((aLabel, index) => {
            const aCheck: IPropsChecks = {
                label: aLabel,
                value: true,
                name: ids[index]
            }
            if (aCheck.name !== ids[1]) {
                theCheckList.add(aCheck);
            }
        })

        return theCheckList;
    }

    function submitForm(values: any) {

        onFilter(values)
    }

    function handleChange(event: React.ChangeEvent<any>) {
        const name = event.target.name
        const value = event.target.value
        const newData = { ...data, [name]: value }
        setData(newData)

        if (name === 'branchName') {
            const branchCodeValue = handleBranchNameChange(value);
            
            if (DataAccessConfigs.isBranchOfUserSelected(user) && branchCodeValue) {
                DataAccessConfigs.setBranchOfUser(value, branchCodeValue)
            }

            // check if no previous branch name was in use already
            if (!DataAccessConfigs.isBranchOfUserSelected(user) && branchCodeValue && !DataAccessConfigs.roleIsCmo(user)) {
                DataAccessConfigs.setBranchOfUser(value, branchCodeValue)
                // reload if role is not CMO
                window.location.reload();
            }

            else {

                const newDataValue = { ...data, ['branchCode']: branchCodeValue };

                submitForm(newDataValue);

            }
        }
        else if (name === 'statuses') {

            const subStatuses = autoHandleSubStatuses(name, value)

            const listingStatuses = subStatuses.getValues().toArray().map((v) => {
                return v['status']
            })

            const listingSubStatuses = subStatuses.getValues().toArray().map((v) => {
                return v['subStatus']
            })

            if (listingStatuses.includes('Error')) {
                listingSubStatuses.concat(WorkflowSubStatus.FailedBMApproval)
                listingSubStatuses.concat("FailedCMOApproval")
            }

            const theNewSubStatusData = { ...data, ['subStatuses']: listingSubStatuses, [name]: listingStatuses }

            submitForm(theNewSubStatusData)

        } else {
            submitForm(newData)
        }

    }

    function handleBranchNameChange(branchName: string) {
        const branchCode = ConstantLabelsAndValues.mapOfDFCUBranchLabelToBranchCode().get(branchName.trim());
        return branchCode;
    }

    function autoHandleSubStatuses(name: string, input: any) {

        let theSubStatuses = new KeyValueMap<any, any>();

        interface IStatusDetails {
            originalStatus: any
            status: any,
            subStatus: any
        }

        const addAStatusDetail = (originalStatus: any, status: any, subStatus: any) => {

            const aDetail: IStatusDetails = {

                originalStatus,
                status,
                subStatus

            };

            theSubStatuses.put(status, aDetail)

        }

        if (name === 'statuses') {

            input.map((e: WorkflowStatus) => {

                if (e === WorkflowStatus.Pending) {
                    addAStatusDetail(WorkflowStatus.Pending, WorkflowStatus.Open, WorkflowSubStatus.AwaitingBMApproval);
                }

                if (e === WorkflowStatus.Approved) {
                    addAStatusDetail(WorkflowStatus.Approved, WorkflowStatus.Open, WorkflowSubStatus.AwaitingSubmissionToFinacle);
                }

                if (e === WorkflowStatus.Cleared) {
                    addAStatusDetail(WorkflowStatus.Cleared, WorkflowStatus.Closed, WorkflowSubStatus.TransactionComplete);
                }

                if (e === WorkflowStatus.New) {
                    addAStatusDetail(WorkflowStatus.New, WorkflowStatus.Open, WorkflowSubStatus.AwaitingCSOApproval);
                }

                if (e === WorkflowStatus.Rejected) {
                    addAStatusDetail(WorkflowStatus.Rejected, WorkflowStatus.Error, WorkflowSubStatus.FailedCSOApproval);
                }

            })

        }

        return theSubStatuses;

    }

    const handleValueChange = (name: string) => (value: any) => {
        if (name === 'from' || name === 'to') {
            value = value ? value.toISOString() : value
        }
        const newData = { ...data, [name]: value }
        setData(newData)
        submitForm(newData)
    }

    function handleExport() {


        downLoadWithParams(remoteRoutes.workflowsReportsDownloadWithParams, data, theData => {
            triggerDownLoad(theData, `file-${getRandomStr(5)}.xlsx`)
        })

        //     downLoad(remoteRoutes.workflowsReports, data => {
        //     triggerDownLoad(data, `file-${getRandomStr(5)}.xlsx`)
        // })
    }

    return <form>

        <Grid spacing={2} container>

            <Grid item xs={gridSize.xs} sm={gridSize.sm} md={gridSize.md} lg={gridSize.lg} xl={gridSize.xl}>
                <PSelectInput
                    name="branchName"
                    value={data['branchName']}
                    onChange={handleChange}
                    label="Branch"
                    variant="outlined"
                    size='small'
                    multiple={false}
                    options={toOptions(branchNamesOnly)}
                    defaultValue={theDefaultBranchName}

                />
            </Grid>

            <Grid item xs={gridSize.xs} sm={gridSize.sm} md={gridSize.md} lg={gridSize.lg} xl={gridSize.xl}>
                <TextField
                    name="applicantName"
                    onChange={handleChange}
                    label="Applicant Name"
                    type="text"
                    variant='outlined'
                    size='small'
                    fullWidth
                />
            </Grid>

            <Grid item xs={gridSize.xs} sm={gridSize.sm} md={gridSize.md} lg={gridSize.lg} xl={gridSize.xl}>
                <TextField
                    name="beneficiaryName"
                    onChange={handleChange}
                    label="Beneficiary Name"
                    type="text"
                    variant='outlined'
                    size='small'
                    fullWidth
                />
            </Grid>

            <Grid item xs={gridSize.xs} sm={gridSize.sm} md={gridSize.md} lg={gridSize.lg} xl={gridSize.xl}>
                <PSelectInput
                    name="workflowTypes"
                    value={data['workflowTypes']}
                    onChange={handleChange}
                    multiple
                    label="Transfer Type"
                    variant="outlined"
                    size='small'
                    options={toOptions(workflowTypes)}
                />
            </Grid>

            <Grid item xs={gridSize.xs} sm={gridSize.sm} md={gridSize.md} lg={gridSize.lg} xl={gridSize.xl} id="status-grid" hidden={check.checks.get("status-grid")}>
                <PSelectInput
                    name="statuses"
                    value={data['statuses']}
                    onChange={handleChange}
                    multiple
                    label="Status"
                    variant="outlined"
                    size='small'
                    options={toOptions(enumToArray(WorkflowStatusInternal))}
                />
            </Grid>

            <Grid item xs={gridSize.xs} sm={gridSize.sm} md={gridSize.md} lg={gridSize.lg} xl={gridSize.xl} id="subStatus-grid" hidden={true}>
                <PSelectInput
                    name="subStatuses"
                    value={data['subStatuses']}
                    onChange={handleChange}
                    multiple
                    label="Sub Status"
                    variant="outlined"
                    size='small'
                    options={toOptions(enumToArray(WorkflowSubStatus))}
                />
            </Grid>

            <Grid item xs={gridSize.xs} sm={gridSize.sm} md={gridSize.md} lg={gridSize.lg} xl={gridSize.xl}
                id="refNumber-grid" hidden={check.checks.get("refNumber-grid")}>
                <TextField
                    name="referenceNumber"
                    value={data['referenceNumber']}
                    onChange={handleChange}
                    label="Ref. Number"
                    type="text"
                    variant='outlined'
                    size='small'
                    fullWidth
                />
            </Grid>

            <Grid item xs={gridSize.xs} sm={gridSize.sm} md={gridSize.md} lg={gridSize.lg} xl={gridSize.xl}
                id="from-grid" hidden={check.checks.get("from-grid")}>
                <PDateInput
                    name="from"
                    value={data['from'] || null}
                    onChange={handleValueChange('from')}
                    label="From"
                    variant="inline"
                    inputVariant='outlined'
                />
            </Grid>

            <Grid item xs={gridSize.xs} sm={gridSize.sm} md={gridSize.md} lg={gridSize.lg} xl={gridSize.xl} id="to-grid"
                hidden={check.checks.get("to-grid")}>
                <PDateInput
                    name="to"
                    value={data['to'] || null}
                    onChange={handleValueChange('to')}
                    label="To"
                    variant="inline"
                    inputVariant='outlined'
                />
            </Grid>

            <Grid item xs={gridSize.xs} sm={gridSize.sm} md={gridSize.md} lg={gridSize.lg} xl={gridSize.xl}>

                <Box>
                    <IconButton
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                        size='small'
                    >
                        <MoreHoriz />
                    </IconButton>
                    <StyledMenu
                        id="customized-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >

                        {
                            checkListShowMoreOrLess().toArray().map((more, index) => {
                                return <StyledMenuItem key={ids[index]}>
                                    <CheckBoxTemplate value={more.value} label={more.label}
                                        name={more.name} />
                                </StyledMenuItem>
                            })
                        }

                    </StyledMenu>

                </Box>

            </Grid>

            <Grid item xs={gridSize.xs} sm={gridSize.sm} md={gridSize.md} lg={gridSize.lg} xl={gridSize.xl}
                className={classes.exportBtn}>
                <Box display="flex" flexDirection="row-reverse">

                    <ExportToExcel dataToExport={formatExportData(filterResult)} />

                </Box>
            </Grid>

        </Grid>
    </form>

}

export default Filter
