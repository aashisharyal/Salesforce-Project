import { LightningElement,wire,track } from 'lwc';
import getorderItemList from '@salesforce/apex/createDataTable.getorderItemList';
import demo from '@salesforce/apex/createDataTable.demo';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';
import delSelectedCons  from '@salesforce/apex/createDataTable.delSelectedCons';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';


const columns = [
   {label: 'Name', fieldName: 'Product_Name__c',type: 'text'},
    { label: 'Quantity', fieldName: 'Quantity__c', },
    { label: 'Total price', fieldName: 'TotalPrice__c', type: 'currency'
 },
    
];

export default class DisplayOrder extends NavigationMixin (LightningElement) {
   
      @track wiredAccountList = [];
      @track accountList = [];
      @track error;
      columns = columns;
      @track isModalOpen = false;
      recordValue = null;
      orderId = null;
      selectedRecords = [];
      @track recordsCount = 0;
  
    @wire(getorderItemList) accList(result) {
            this.wiredAccountList = result;
            this.recordValue = result;
  
      if (result.data) {
            this.accountList = result.data;
            this.error = undefined;
      } else if (result.error) {
            this.error = result.error;
            this.accountList = [];
      }
    }


    // Getting selected rows
    // starting for the deletion of selected record 
    getSelectedRecords(event) {
      // getting selected rows
      const selectedRows = event.detail.selectedRows;
      
      this.recordsCount = event.detail.selectedRows.length;

      // this set elements the duplicates if any
      let conIds = new Set();

      // getting selected record id
      for (let i = 0; i < selectedRows.length; i++) {
          conIds.add(selectedRows[i].Id);
      }
      // coverting to array
      this.selectedRecords = Array.from(conIds);

      
  }

  // delete records process function
  deleteAccounts() {
   if (this.selectedRecords) {
       // calling apex class to delete selected records.
       this.deleteCons();
   }
}


  deleteCons() {
   delSelectedCons({lstConIds: this.selectedRecords})
   .then(result => {
       // showing success message
       this.dispatchEvent(
           new ShowToastEvent({
               title: 'Success!!', 
               message: this.recordsCount  + '  Order Item is Deleted', 
               variant: 'success'
           }),
       );
       
       // Clearing selected row indexs 
       this.template.querySelector('lightning-datatable').selectedRows = [];

       this.recordsCount = 0;

       // refreshing table data using refresh apex
       return refreshApex(this.wiredAccountList);

   })
   .catch(error => {
       window.console.log(error);
       this.dispatchEvent(
           new ShowToastEvent({
               title: 'Error while getting Items', 
               message: error.message, 
               variant: 'error'
           }),
       );
   });
}  


   handleSubmit(event)
   {
     this.isModalOpen = true;
     this.orderId = this.recordValue.data[0].orders__c;

   }

   handleCancel()
   {
    
   }

    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
    }

   seeItems()
   {
      refreshApex(this.wiredAccountList);
   }


   submitDetails()
   {
      this.isModalOpen = false;
     // this.loading =true;
   }


   
   navigateOrder()
   {  
      this[NavigationMixin.Navigate]({
         type: 'standard__recordPage',
             attributes: {
             //recordId: 'a0D5j000006t3BCEAY',
             recordId: this.recordValue.data[0].orders__c,
             actionName: 'view'
                         }
     });

   } 
   
}
   


