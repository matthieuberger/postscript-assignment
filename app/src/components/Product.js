import React from 'react'
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AddMessageModal from './AddMessage';
import Message from './Message';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      margin: 20,
      backgroundColor: 'white'
    }
  }));

const Product = (props) => {

    const classes = useStyles();
    const selectedProduct = props.product;

    return (
        <Grid container className={classes.root}>
            <AddMessageModal></AddMessageModal>
            <Grid item xs={12}>
                <Typography variant="h3">
                    { selectedProduct !== null && selectedProduct.id} - {selectedProduct !== null && selectedProduct.name}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                {selectedProduct !== null && selectedProduct.messages.map(message => (
                    <Message key={message.id} message={message} />
                ))}
            </Grid>
        </Grid>
    )
}
export default Product;