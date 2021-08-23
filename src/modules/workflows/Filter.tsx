import * as React from "react";
import {useEffect, useState} from "react";
import {flatMap, uniqBy} from "lodash";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {IOption, toOptions} from "../../components/inputs/inputHelpers";
import {Box, Menu, MenuProps} from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import PSelectInput from "../../components/plain-inputs/PSelectInput";
import PDateInput from "../../components/plain-inputs/PDateInput";
import {enumToArray, getRandomStr} from "../../utils/stringHelpers";
import {IWorkflowFilter, WorkflowStatus, WorkflowSubStatus} from "./types";
import {workflowTypes} from "./config";
import {PRemoteSelect} from "../../components/inputs/XRemoteSelect";
import {remoteRoutes} from "../../data/constants";
import {useSelector} from "react-redux";
import {IState} from "../../data/types";
import {downLoad, triggerDownLoad} from "../../utils/ajax";
import {IList, List} from "../../utils/collections/list";
import CheckBoxTemplate, {IPropsChecks} from "../scan/validate-verify/Check";

import MenuItem from "@material-ui/core/MenuItem";

import makeStyles from "@material-ui/core/styles/makeStyles";
import {Theme, withStyles} from "@material-ui/core/styles";
import createStyles from "@material-ui/core/styles/createStyles";

import IconButton from "@material-ui/core/IconButton";

import {ICheckKeyValueState} from "../../data/redux/checks/reducer";
import {MoreHoriz} from "@material-ui/icons";
import {IKeyValueMap, KeyValueMap} from "../../utils/collections/map";
import {ObjectUtils} from "../../utils/objectHelpers";


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
    setFilteredData?: (dataFiltered: any) => any

    setSearchIsHappening?: (flag: boolean) => any
}

interface IFilterResult {
    result: IList<any>[]
}

export class FilterResult {

    private static result: IKeyValueMap<string, IWorkflowFilter> = new KeyValueMap<string, IWorkflowFilter>();

    static setResult(result: any[]): void {

        if (result.length > 0) {

            FilterResult.result.clear();

            result.map((e) => {
                const demandedData = e["demandedData"]
                const parsed = new Object(demandedData)
                console.log('demandedData', JSON.stringify(parsed))

                // @ts-ignore
                FilterResult.result.put(Object.values(parsed)[0], parsed);
            })
        }

    }

    static getResult() {
        return FilterResult.result;
    }

}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            width: '100%'
            // margin: theme.spacing(1),
            // minWidth: 120,
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


const Filter = ({onFilter, loading, setFilteredData, setSearchIsHappening}: IProps) => {

    const classes = useStyles();

    const [data, setData] = useState<IWorkflowFilter>({
        from: null,
        to: null,
        statuses: [],
        subStatuses: [],
        workflowTypes: [],
        //referenceNumber: '',
        //idNumber: '',
        //userId: '',
        applicantName: '',
        beneficiaryName:''
    })

    const [searchValueApplicantName, setSearchValueApplicantName] = useState('')
    const [searchHappening, setSearchHappening] = useState(false)

    const [searchData, setSearchedData] = useState<any[]>([])

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const gridSize: any = {
        xs: 6,
        sm: 3,
        md: 2,
        lg: 2,
        xl: 1
    }

    const {check}: ICheckKeyValueState = useSelector((state: any) => state.checks)

    useEffect(() => {

    }, [check,searchData, searchHappening])
    console.log('filtered:', data)
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
            theCheckList.add(aCheck);
        })

        return theCheckList;
    }

    function submitForm(values: any) {
        console.log("new from search:", values)
        onFilter(values)
    }

    function handleChange(event: React.ChangeEvent<any>) {
        const name = event.target.name
        const value = event.target.value

        const newData = {...data, [name]: value}
        setData(newData)
        submitForm(newData)
    }

    const handleValueChange = (name: string) => (value: any) => {
        if (name === 'from' || name === 'to') {
            value = value ? value.toISOString() : value
        }
        const newData = {...data, [name]: value}
        setData(newData)
        submitForm(newData)
    }

    const handleComboValueChange = (name: string) => (value: any) => {
        console.log("name: ", name)
        console.log("value: ", value)
        // const newData = {...data, [name]: value}
        const newData = {...data, [name]: value}
        console.log("newData: ", newData)
        const newFilterData = {...data, [name]: value ? value.id : null}
        console.log("newFilterData: ", newFilterData)
        setData(newData)
        if (setFilteredData) {
            setFilteredData(FilterResult.getResult().getValues().toArray())
        }

        // determineSearchHappening()

        submitForm(newFilterData)
    }

    function handleExport() {
        downLoad(remoteRoutes.workflowsReports, data => {
            triggerDownLoad(data, `file-${getRandomStr(5)}.xlsx`)
        })
    }

    return <form>
        <Grid spacing={2} container>

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

            <Grid item xs={gridSize.xs} sm={gridSize.sm} md={gridSize.md} lg={gridSize.lg} xl={gridSize.xl}
                  id="status-grid" hidden={check.checks.get("status-grid")}>
                <PSelectInput
                    name="statuses"
                    value={data['statuses']}
                    onChange={handleChange}
                    multiple
                    label="Status"
                    variant="outlined"
                    size='small'
                    options={toOptions(enumToArray(WorkflowStatus))}
                />
            </Grid>

            {/*<Grid item xs={gridSize.xs} sm={gridSize.sm} md={gridSize.md} lg={gridSize.lg} xl={gridSize.xl}*/}
            {/*      id="subStatus-grid" hidden={check.checks.get("subStatus-grid")}>*/}
            {/*    <PSelectInput*/}
            {/*        name="subStatuses"*/}
            {/*        value={data['subStatuses']}*/}
            {/*        onChange={handleChange}*/}
            {/*        multiple*/}
            {/*        label="Sub Status"*/}
            {/*        variant="outlined"*/}
            {/*        size='small'*/}
            {/*        options={toOptions(enumToArray(WorkflowSubStatus))}*/}
            {/*    />*/}
            {/*</Grid>*/}

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
                        <MoreHoriz/>
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
                                                      name={more.name}/>
                                </StyledMenuItem>
                            })
                        }

                    </StyledMenu>

                </Box>

            </Grid>

            <Grid item xs={gridSize.xs} sm={gridSize.sm} md={gridSize.md} lg={gridSize.lg} xl={gridSize.xl}
                  className={classes.exportBtn}>
                <Box display="flex" flexDirection="row-reverse">
                    <Button
                        disabled={loading}
                        variant="outlined"
                        color="primary"
                        onClick={handleExport}>Export</Button>
                </Box>
            </Grid>

        </Grid>
    </form>

}

export default Filter
