import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import {SampleAPIService} from '../services/sample-api.service'
import {LoadingService} from '../services/loading.service'
import { LoadingComponent } from '../loading/loading.component';
import { Subject } from 'rxjs';
import { json } from 'node:stream/consumers';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [FormsModule,CommonModule,RouterModule,LoadingComponent],
}) 
export class ChatComponent {
  firstscroll = false;
  questionlist = [];
  name: string;
  scrollHeight = 0;
  title = 'sample-app';
  htmlContent: string = '';
  oldresponse = ``;
  rawText = ``;
  // rawText = `A free trial is a promotional mechanism that allows potential customers to experience a product or service
  //        for a limited period of time without cost. Here’s a breakdown of key aspects and options related to free  
  //        trials:                                                                                                   
                                                                                                                   
  //        ### Purpose of Free Trials                                                                                
  //        - **Attract New Customers**: Free trials serve as a way to let prospective customers try out products or  
  //        services before deciding to make a purchase.                                                              
  //        - **Upgrade Potential**: The goal is to attract users with the free trial, providing an opportunity to    
  //        transition them into paying customers once they see the value.                                            
                                                                                                                   
  //        ### Types of Free Trials                                                                                  
  //        1. **Time-Limited Free Trials**:                                                                          
  //           - These are free trials that are available for a certain period, like 14 days or a month.              
  //           - Users generally have two options when the trial ends:                                                
  //             - **Sign On for a Paid Plan**: Users can choose to continue the service by subscribing to a paid     
  //        plan.                                                                                                     
  //             - **Automatic Conversion to a Paid Plan**: Users are automatically subscribed to a paid plan if they 
  //        do not cancel before the trial ends.                                                                      
                                                                                                                   
  //        2. **Endless Free Trials**:                                                                               
  //           - These have no expiration date but offer only a basic version of the product with limited features.   
  //           - The customer can upgrade to a paid version anytime to unlock additional features.                    
                                                                                                                   
  //        ### Administration of Free Trials in Zuora                                                                
  //        - **Outside of Zuora**: You can manage trial accounts externally and only create a subscription in Zuora  
  //        when the prospective customer decides to purchase.                                                        
  //        - **Inside Zuora**: The trial is managed within Zuora. The system waits to charge the customer until the  
  //        trial has ended, making it applicable for time-limited trials.                                            
                                                                                                                   
  //        ### Considerations for Implementing Free Trials                                                           
  //        - **Subscription Dates and Charges**:                                                                     
  //          - Two main dates to consider: the free trial start (Contract Effective Date) and the date charges begin 
  //        if the user converts (Service Activation Date).                                                           
  //          - Charge models can be flat fees (with a charge amount of $0) or discounts showing usual prices and     
  //        applying a full discount for the trial period.                                                            
                                                                                                                   
  //        ### Examples of Free Trial Offers                                                                         
  //        1. **14-Day Free Trial with Automatic Conversion**: Starts free, then automatically converts to a paid    
  //        monthly plan after the trial ends.                                                                        
  //        2. **One-Month Free Trial with Automatic Conversion using Discount Model**: Offers a discount for the     
  //        first month, converting to paid thereafter.                                                               
  //        3. **Option to Sign-On after a One-Month Free Trial**: Allows the customer to decide whether to continue  
  //        and subscribe to a paid plan post-trial.                                                                  
                                                                                                                   
  //        For more details on the implementation of free trials in Zuora, you can refer to [Zuora's detailed        
  //        guide](https://knowledgecenter.zuora.com/Quick_References/How_Do_I_._._./How_do_I_handle_free_trials_in_Zu
  //        ora%3F).                                                                                                  
                                                                                                                   
  //        These details should provide a foundational understanding of what free trials entail and how they are     
  //        typically structured.`

//   rawText= `âœ… Token retrieved successfully!
// âœ… Product created successfully: {'Id': '4627c9fa4b7f402fb5119c1b5583a1aa', 'Success': True}`

  messages: { text: string; type: 'user' | 'ai' }[] = [
    { text: "Hello! How can I assist you?", type: 'ai' }
  ];

  userdata = {
     prompt : '',
        config_var: ''
  };

  formattedMessages: any[] = [];

  @ViewChild('chatBox') chatBox!: ElementRef;
  @ViewChild('chatBox') chatBox1!: ElementRef;

  subject = new Subject<string>();

  
  constructor(public SampleAPIService: SampleAPIService , public LoadingService:LoadingService) {

  }

  ngOnInit() {
    //this.htmlContent = this.parseTextToHtml(this.rawText);
    //this.sendrequest();

  }

  //Function to convert raw text to HTML
  parseTextToHtml(rawText: string): string {
    let htmlText = rawText;

    // Step 1: Handle escaped quotes (\" becomes ")
    htmlText = htmlText.replace(/\\"/g, '"');
    
    // Step 2: Convert markdown headers (###) to <h3> tags
    htmlText = htmlText.replace(/^\s*###\s+(.*)$/gm, '<h3>$1</h3>');
    htmlText = htmlText.replace(/^\s*##\s+(.*)$/gm, '<h2>$1</h2>');
    htmlText = htmlText.replace(/^\s*#\s+(.*)$/gm, '<h1>$1</h1>');

    const extracted = this.extractJsonStringSafe(htmlText);
    //const extracted = rrr == null ? htmlText : rrr.replace(/\*\*/g, '');
    // Step 3: Replace single newline characters with <br/> tags if they are not separating paragraphs
    // htmlText = htmlText.replace(/\n/g, '<br/>');
    htmlText = htmlText.replace(/([^\n])\n([^\n])/g, '$1<br/>$2');

    // Step 4: Convert markdown-style bold (**bold**) to <strong>bold</strong>
    htmlText = htmlText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Step 5: Convert markdown-style links [text](url) to <a href="url" target="_blank">text</a>
    htmlText = htmlText.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Step 6: Convert markdown lists (- and 1.) to <ul> and <ol> respectively
    htmlText = htmlText.replace(/^\-\s+(.*)$/gm, '<ul><li>$1</li></ul>');
    htmlText = htmlText.replace(/^\d\.\s+(.*)$/gm, '<ol><li>$1</li></ol>');

    // Step 7: Convert inline code (`code`) to <code>code</code>
    htmlText = htmlText.replace(/`(.*?)`/g, '<code>$1</code>');

    // Step 8: Convert paragraph breaks (\n\n) into <p></p> tags for proper paragraph separation
    htmlText = htmlText.replace(/\n\n/g, '</p><p>');


    htmlText = htmlText.replace(/âœ…/g, '✅');

    // Step 9: Wrap the entire content with <p> to ensure proper structure
    htmlText = `<p>${htmlText}</p>`;

    return htmlText;
  }



  onclick() {
    this.SampleAPIService.loading = true;
    this.LoadingService.show();
    if (this.name) {
      this.questionlist.push(this.name)
    }
    if (!this.name.trim()) return;

    // Add user message
    this.messages.push({ text: this.name, type: 'user' });
    this.scrollToBottom();
   
    // Simulate AI response after a short delay

      if(this.name.toLocaleLowerCase() == 'y' || this.name.toLocaleLowerCase() == 'n'){
        this.sendRequestforUpdate(this.name)
      } else {
        this.sendRequest(this.name);
      }


    
    // setTimeout(() => {
    //   this.messages.push({ text: this.parseTextToHtml(this.rawText), type: 'ai' });
    //   this.SampleAPIService.loading = false;
    //   this.LoadingService.hide();
    //   this.scrollToBottom1();
    // }, );

  }


  scrollToBottom() {
    setTimeout(() => {
      // this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
      //this.chatBox.nativeElement.scrollTo({ top: this.chatBox.nativeElement.scrollHeight + 100, behavior: 'smooth' });
      const chatElement = this.chatBox.nativeElement;
      this.scrollHeight = this.chatBox.nativeElement.scrollHeight;
      const extraPadding = this.messages.length > 10 ? 150 : 100; // Extra space at the bottom
      this.chatBox.nativeElement.scrollTo({
        top: chatElement.scrollHeight + extraPadding,
        behavior: 'smooth'
      });
    }, );
  }


  scrollToBottom1() {
    if(this.firstscroll){
      setTimeout(() => {
         const chatElement = this.chatBox.nativeElement;
         this.chatBox.nativeElement.scrollTo({
           top: this.scrollHeight - 100,  
           behavior: 'smooth'
         });
       }, );
    }
    this.firstscroll = true;
  }

  
  onEnter() {
    if (this.name.trim()) {
      console.log('Message sent:', this.name);
      this.onclick();
      // this.name = '';  // Clear input after sending
    }
  }

  priviosQuestion(que){
    this.name = que
    this.onclick();
  }

  async  sendRequest(name) {
    try {
      const result = await this.SampleAPIService.postData(name);
      console.log("API Success:", result.result);
      this.rawText = result == null ? '' : result.result;
      this.SampleAPIService.sendMessage(result.response);
      this.oldresponse = result.response;

      setTimeout(() => {
        this.messages.push({ text: this.parseTextToHtml(this.rawText), type: 'ai' });
        this.SampleAPIService.loading = false;
        this.LoadingService.hide();
        this.scrollToBottom1();
         
        this.name = '';
      }, );

      
    } catch (error) {
      this.name = '';
      console.error("API Error:", error);
      this.LoadingService.hide();
    }
  }


  async  sendRequestforUpdate(name) {
      let res


    try {
// const yyy = await this.someMethod()
      let data = {
        response : this.oldresponse,
        config_var:name
      }

      const result = await this.SampleAPIService.postDataforUpdate(data);
      console.log("API Success:", result.message);
      this.rawText = result == null ? '' : result.message;

      setTimeout(() => {
        this.messages.push({ text: this.parseTextToHtml(this.rawText), type: 'ai' });
        this.SampleAPIService.loading = false;
        this.LoadingService.hide();
        this.scrollToBottom1();
        this.name = '';
      }, );

      
    } catch (error) {
      this.name = '';
      console.error("API Error:", error);
      this.LoadingService.hide();
    }
  }


  async someMethod() {
    const result = await this.ggg();
    return result
  }

  extractJsonStringSafe(text) {

    const htmldata = text.split("json");

    if(htmldata[1]){
      const start = htmldata[1].indexOf('{');
      if (start === -1) return null;
    
      let openBraces = 0;
      let end = -1;
    
      for (let i = start; i < htmldata[1].length; i++) {
        if (htmldata[1][i] === '{') openBraces++;
        if (htmldata[1][i] === '}') openBraces--;
    
        if (openBraces === 0) {
          end = i;
          break;
        }
      }
    
      if (end === -1) return null;
    
      const jsonString = htmldata[1].slice(start, end + 1);
      return jsonString;
    }

    return null
   
  }


  ggg(){
    this.SampleAPIService.message$.subscribe(message => {
      console.log("Received:", message);
    return message
    });
  }
  
  
  
}
