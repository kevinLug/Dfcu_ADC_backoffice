import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";

interface IProps {
    title: string;
    children: any;
}
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        pageHeading: {
            display: "flex",
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            flexBasis: "33.33%",
            flexShrink: 0,
        },
        filterPaper: {
            borderRadius: 0,
            padding: theme.spacing(2),
        },
    })
);

type Anchor = "top" | "left" | "bottom" | "right";

const ExpansionCard = ({ title, children }: IProps) => {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChange = (panel: string) => (
        event: React.ChangeEvent<{}>,
        isExpanded: boolean
    ) => {
        setExpanded(isExpanded ? panel : false);
    };
    return (
        <div>
            <ExpansionPanel
                expanded={expanded === "panel5"}
                onChange={handleChange("panel5")}
            >
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel5bh-content"
                    id="panel5bh-header"
                >
                    <Typography className={classes.heading}>{title}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>{children}</ExpansionPanelDetails>
            </ExpansionPanel>
        </div>
    );
};

export default ExpansionCard;
