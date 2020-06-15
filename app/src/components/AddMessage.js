import React, { useState, useContext } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogContent';
import { ProductContext } from '../context/ProductContext';

const AddMessage = (props) => {

    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false);
    const [, selectedProductId, selectedProduct, , setSelectedProduct] = useContext(ProductContext);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const postMessage = () => {
        axios.post('http://localhost:5000/messages', {
            content: message,
            product_id: selectedProductId
        })
            .then(response => {
                // Successfully create new message
                // Update current selected product message list
                const message = { content: response.data.data.content, id: response.data.data.id }
                const updatedProduct = { ...selectedProduct, messages: [...selectedProduct.messages, message] }
                setSelectedProduct(updatedProduct);

                // Close modal
                handleClose();
            })
            .catch(error => {
                console.log(error.response)
            });
    }

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Add Message
      </Button>
            <Dialog open={open} onClose={handleClose} fullWidth={true}
                maxWidth="sm" aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add a new message</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Message"
                        type="text"
                        fullWidth
                        multiline
                        inputProps={{
                            maxLength: 250
                        }}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
          </Button>
                    <Button onClick={postMessage} color="primary">
                        Add
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddMessage;