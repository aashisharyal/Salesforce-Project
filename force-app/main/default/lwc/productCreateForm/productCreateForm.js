import { LightningElement, api } from 'lwc';
import search_category from '@salesforce/schema/Product__c.category__c';
import enter_name from '@salesforce/schema/Product__c.Product_Name__c';
import enter_price from '@salesforce/schema/Product__c.Price__c';
import enter_availability from '@salesforce/schema/Product__c.In_Stock__c';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';




export default class ProductCreateForm extends NavigationMixin(LightningElement) {
    @api recordId;
    fields = [search_category, enter_name,enter_price,enter_availability];
    handleSuccess(e) {
        const evt = new ShowToastEvent({
        title: " New Product added",
        message: e.detail.id,
        variant: "success"
       })     
       this.dispatchEvent(evt);
       this.navigateToRecordPage(e.detail.id);
    }
    navigateToRecordPage(id) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: id,
                actionName: 'view' 
            }
        });
    }
}