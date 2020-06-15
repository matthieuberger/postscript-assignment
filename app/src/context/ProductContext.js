import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';

export const ProductContext = createContext();

export const ProductProvider = (props) => {

    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Fetch all the products once
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get('http://localhost:5000/products');
            setProducts(response.data.data);
        }
        fetchData();
    }, []);

    // Fetch product with messages each time the selected product changes
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`http://localhost:5000/products/${selectedProductId}`);
            setSelectedProduct(response.data.data);
        }
        if (selectedProductId !== null) {
            fetchData();
        }
    }, [selectedProductId]);

    return (
        <ProductContext.Provider value={
            [products,
            selectedProductId,
            selectedProduct,
            setSelectedProductId,
            setSelectedProduct]
        }>
            {props.children}
        </ProductContext.Provider>
    )


}

export default ProductProvider;