import React from "react";
import {Field, FieldProps, getIn} from 'formik';
import 'date-fns';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import DateFnsUtils from '@date-io/date-fns';
import {KeyboardDatePicker, DatePicker, MuiPickersUtilsProvider,} from '@material-ui/pickers'
import {hasValue} from "./inputHelpers";

interface IProps {
    name: string
    label: string
}

const Component = ({field, form, ...other}: FieldProps) => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const error = getIn(form.errors, field.name);
    const isTouched = getIn(form.touched, field.name);
    const wasSubmitted = form.submitCount > 0;
    const showError = hasValue(error) && (isTouched || wasSubmitted)

    function handleTouch() {
        return form.setFieldTouched(field.name, true, true);
    }

    function handleChange(date: any) {
        return form.setFieldValue(field.name, date, true);
    }

    return <MuiPickersUtilsProvider utils={DateFnsUtils}>
        {
            isSmall?
                <DatePicker
                    variant="inline"
                    margin="normal"
                    format="dd/MM/yyyy"
                    name={field.name}
                    value={field.value || null}
                    helperText={showError && error}
                    error={Boolean(showError)}
                    onClose={handleTouch}
                    onChange={handleChange}
                    onTouchEnd={handleTouch}
                    onBlur={handleTouch}
                    autoOk
                    {...other}
                />
                :
                <KeyboardDatePicker
                    variant="inline"
                    margin="normal"
                    format="dd/MM/yyyy"
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                    autoOk
                    name={field.name}
                    value={field.value || null}
                    helperText={showError && error}
                    error={Boolean(showError)}
                    onClose={handleTouch}
                    onChange={handleChange}
                    onTouchEnd={handleTouch}
                    onBlur={handleTouch}
                    {...other}
                />
        }
    </MuiPickersUtilsProvider>
}

const XDateInput = (props: IProps) => {
    return (
        <Field
            name={props.name}
            label={props.label}
            component={Component}
        />
    )
}

export default XDateInput
