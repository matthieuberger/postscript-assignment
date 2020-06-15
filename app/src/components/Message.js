import React from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import SendMessage from './SendMessage';

const Message = (props) => {

    const message = props.message;

    return (
        <Card>
            <CardContent>
                <Typography variant="h5">
                    MessageId: {message.id}
                </Typography>
                <Typography variant="h6">
                    Content: {message.content}
                </Typography>

            </CardContent>
            <CardActions>
                <SendMessage messageId={message.id}></SendMessage>
            </CardActions>
        </Card>
    )
}

export default Message;