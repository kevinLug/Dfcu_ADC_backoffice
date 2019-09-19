import * as React from 'react'
import {Field, FieldProps, getIn} from 'formik';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {hasValue, IOption} from "./inputHelpers";

interface IProps {
    label: string
    name: string
    options: IOption[]
    multiple?: boolean
}

const Component = (fieldProps: FieldProps & IProps) => {
    const {field, form, options, ...rest} = fieldProps
    const name = field.name;
    const value = field.value;
    const error = getIn(form.errors, name);
    const isTouched = getIn(form.touched, name);
    const wasSubmitted = form.submitCount > 0;
    const showError = hasValue(error) && (isTouched || wasSubmitted)

    function handleTouched() {
        form.setFieldTouched(field.name, true, true);
    }

    return <FormControl error={showError} fullWidth>
        <InputLabel htmlFor={name}>{rest.label}</InputLabel>
        <Select
            {...field}
            onClose={handleTouched}
            onBlur={handleTouched}
            value={value || ''}
            fullWidth
            multiple={rest.multiple}
            inputProps={{name}}
        >
            {
                options.map(
                    it => <MenuItem
                        value={it.value}
                        key={it.value}
                    >{it.label}</MenuItem>
                )
            }
        </Select>
        {
            showError && <FormHelperText>{error}</FormHelperText>
        }
    </FormControl>
}

const SelectInput = (props: IProps) => {
    return (
        <Field
            {...props}
            component={Component}
        />
    )
}

export default SelectInput
