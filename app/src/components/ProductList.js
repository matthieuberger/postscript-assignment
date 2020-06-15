import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Product from './Product';
import { ProductContext } from '../context/ProductContext';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    selectedProduct: {
        padding: 10
    }
}));


const ProductList = () => {

    const classes = useStyles();
    const [products, , selectedProduct, setSelectedProductId] = useContext(ProductContext);

    return (
        <Grid container className={classes.root} spacing={1}>
            <Grid item xs={2}>
                <List>
                    {products.map(product => (
                        <ListItem button key={product.id} onClick={() => setSelectedProductId(product.id)
                        }>
                            <ListItemText primary={product.name} />
                        </ListItem>
                    ))}
                </List>
            </Grid>
            <Grid item xs={9} className={classes.selectedProduct}>
                { selectedProduct && <Product product={selectedProduct} />}
            </Grid>
        </Grid>
    )
}
export default ProductList;