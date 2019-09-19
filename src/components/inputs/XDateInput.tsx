import React from "react";
import {Field, FieldProps} from 'formik';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {KeyboardDatePicker, MuiPickersUtilsProvider,} from '@material-ui/pickers'

interface IProps {
    name: string
    label: string
}

const Component = ({field, form, ...other}: FieldProps) => {
    const currentError = form.errors[field.name];

    function handleTouch() {
        return form.setFieldTouched(field.name, true, true);
    }

    function handleChange(date: any) {
        return form.setFieldValue(field.name, date, true);
    }

    return <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
            margin="normal"
            format="MM/dd/yyyy"
            KeyboardButtonProps={{
                'aria-label': 'change date',
            }}
            name={field.name}
            value={field.value || null}
            helperText={currentError}
            error={Boolean(currentError)}
            onClose={handleTouch}
            onChange={handleChange}
            {...other}
        />
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
