import React from 'react';
import {Provider} from 'react-redux'
import {ThemeProvider,} from '@material-ui/styles';
import {BrowserRouter as Router} from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import store from "../data/redux/store";
import '../index.css';
import theme from "../theme";
import {Grid} from "@material-ui/core";

const StoryWrapper = ({children}: any) => <div style={{width: '100%', padding: 16}}>
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <Router>
                <div style={{width: '90%', padding: 16}}>
                    <Grid container>
                        <Grid item xs={12}>
                            {children}
                        </Grid>
                    </Grid>
                </div>
            </Router>
        </ThemeProvider>
    </Provider>
</div>
export default StoryWrapper


