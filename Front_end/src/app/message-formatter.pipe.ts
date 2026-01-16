import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'messageFormatter'
})
export class MessageFormatterPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    // Convert ✅ (or similar symbols) to formatted HTML
    value = value.replace(/âœ…/g, '✅');

    // Detect JSON object inside the text
    const jsonMatch = value.match(/\{(.+?)\}/);
    if (jsonMatch) {
      try {
        // Parse JSON-like data
        const jsonData = JSON.parse(jsonMatch[0].replace(/'/g, '"'));
        return `
          <div class="message">
            ✅ Product created successfully:<br>
            <strong>ID:</strong> ${jsonData.Id} <br>
            <strong>Success:</strong> ${jsonData.Success}
          </div>
        `;
      } catch (error) {
        return `<div class="message">${value}</div>`; // Fallback if JSON parsing fails
      }
    }

    return `<div class="message">${value}</div>`;
  }
}
