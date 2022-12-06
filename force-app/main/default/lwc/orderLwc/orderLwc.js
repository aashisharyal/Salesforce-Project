import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class OrderLwc extends LightningElement {
    orderCreated = false;
    fields = [order_date];
    handleSuccess(event) { 
        event = new ShowToastEvent({
            title: 'Success!',
            message: 'Order Created',
        });
        this.dispatchEvent(event);
    }
}