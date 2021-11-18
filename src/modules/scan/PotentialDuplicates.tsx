import { Grid } from "@material-ui/core"
import React from "react"
import Workflows from "../workflows/Workflows"
import { wfInitialSort, workflowHeadCellsNew, workflowTypes } from "../workflows/config";
import XTable from "../../components/table/XTable";


interface IProps {
  data: any
}

const PotentialDuplicates = ({ data }: IProps) => {
  console.log('found-', data)
  return <Grid container spacing={2}>

    {/* <Grid item sm={6}>
          <Typography variant='h4'>All Applications</Typography>
      </Grid>

      <Grid item sm={12}>

          <Filter onFilter={handleFilter} loading={loadingFilter} filterResult={data} />

      </Grid> */}

    <Grid item xs={12}>

      <XTable
        // loading={loadingNew}
        headCells={workflowHeadCellsNew}
        data={data}
        initialRowsPerPage={data.length}
        usePagination={true}
        // onFilterToggle={handleFilterToggle}
        initialSortBy={wfInitialSort}
        initialOrder="desc"
      />

    </Grid>

  </Grid>

}

export default PotentialDuplicates