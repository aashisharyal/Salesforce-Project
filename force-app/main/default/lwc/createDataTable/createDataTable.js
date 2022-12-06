import { LightningElement,track,wire} from "lwc";
import getdata from '@salesforce/apex/createDataTable.getdata';
import senddata from '@salesforce/apex/createDataTable.senddata';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {refreshApex} from '@salesforce/apex';
export default class createDataTable extends LightningElement{
    grid;
    error;
    recordIds=[];
    searchWords='';
    idImageURLMap = [];
    contentId = null;
    name = null;
    quantityAmt = 0;
    @track data;
    @track AccountList = [];
@track isModalOpen = false;
    
    handleSearch(event)
    {
        this.searchWords = event.target.value;
        this.loaddata(this.searchWords);
    }

    connectedCallback()
    {
        this.loaddata(this.searchWords);
    }

     loaddata(searchWords)
     {
         getdata({searchkey : searchWords})
         .then(result => {
             this.grid = result;
            // console.log("result", result);
             //console.log("ID",result.roomid);
         })
         .catch(error => {
             this.error = error;
         })
 }
    handleAdd()
    {
    }
    openModal(event) {
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
        this.contentId = event.target.value;
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
    }
    addQuantity(event)
    {
        this.quantityAmt = event.target.value;
        if(this.quantityAmt<1 && this.quantityAmt !=null && this.quantityAmt !=undefined ){
            console.log('reached here',event);
            this.dispatchEvent(
                new ShowToastEvent({
                  title: " !!! Error !!!",
                  message: 'The quantity cannot be  '+ event.target.value,
                  variant: "error",
                  mode: "sticky"
                })
              );
        }    
    }
    submitDetails() {  
       this.isModalOpen = false;
       this.loading = false;
     senddata({recordId : this.contentId, quantity : this.quantityAmt })    
        .then(result => {
             //this.AccountList = result;
            // console.log('result is ' + this.AccountList );
                this.name = result.Name;
                this.loading = true;
                const evt = new ShowToastEvent({
                    title: " Order Added In Cart",
                    message: this.name,
                    variant: "success"
           })     
           this.dispatchEvent(evt);
   })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                  title: "Exceeds Stock Quantity!",
                  message: 'Cannot exceed in stock quantity',
                  variant: "error"
                })
              );
          this.error = error;
          this.loading = false;
       })
       console.log('value in grid is ' + json.stringfy(this.grid));
       refreshApex(this.grid);
}
}