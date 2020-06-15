import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import ProductProvider from './context/ProductContext'; 
import NavBar from './components/NavBar';
import ProductList from './components/ProductList';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: '#d3d3d3'
  },
}));

const App = () => {

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <NavBar />
      <ProductProvider>
        <Grid container spacing={1}>
          <ProductList></ProductList>
        </Grid>
      </ProductProvider>
    </div>
  )
}

export default App