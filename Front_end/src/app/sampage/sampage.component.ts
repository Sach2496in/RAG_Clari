import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sampage',
  standalone: true,
  templateUrl: './sampage.component.html',
  styleUrl: './sampage.component.scss',
  imports: [FormsModule,CommonModule,RouterModule],
})
export class SampageComponent {

  @ViewChild('chatContainer') chatContainer!: ElementRef;
  userInput: string = '';
  latestQuestion: string = '';

  askQuestion() {
    if (this.userInput.trim()) {
      this.latestQuestion = this.userInput;
      this.userInput = ''; // Clear input field
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  private scrollToBottom() {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }
}
