import React, { useState } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogContent';

const SendMessage = (props) => {

    const messageId = props.messageId;
    const [phone, setPhone] = useState("");
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const sendMessage = () => {
        axios.post(`http://localhost:5000/messages/${messageId}/send`, {
            phone: phone,
        })
            .then(response => {
                handleClose();
            })
            .catch(error => {
                console.log(error.response)
            });
    }

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Send
      </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add a new message</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Phone Number"
                        type="phone"
                        fullWidth
                        inputProps={{
                            maxLength: 10
                        }}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
          </Button>
                    <Button onClick={sendMessage} color="primary">
                        Send
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default SendMessage;