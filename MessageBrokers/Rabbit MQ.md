### Acknowledge modes in RABBIT MQ
##### Nack
- Negative Acknowledgement
- Negative acknowledgement is used when a consumer had to send a message that he has failed to processing the current message
- The message will not be lost
##### Automatic Acknowledgement
- When auto ack is enabled **rabbit mq** considers aknowledgment as soon as the message is delivered to the consumer.
##### Reject with reqeue true
- The rejected message will be placed back into the queque with if requeque option is on
##### Reject with reqeue false
